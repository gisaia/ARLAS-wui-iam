#!/bin/bash
set -e

if  [ -z "$GITHUB_CHANGELOG_TOKEN"  ] ; then echo "Please set GITHUB_CHANGELOG_TOKEN environment variable"; exit -1; fi

function clean {
    ARG=$?
	echo "==> Exit status = $ARG"
    exit $ARG
}
trap clean EXIT

usage(){
    echo "Usage: ./release.sh -rel=X [--no-tests]"
    echo " -rel|--app-release               Release arlas-wui-iam X version"
	echo " -dev|--app-dev                   Development arlas-wui-iam (-SNAPSHOT qualifier will be automatically added)"
	echo " --no-tests                       Skip running integration tests"
    echo " --not-latest                     Doesn't tag the release version as the latest."
    echo " -s|--stage                       Stage of the release : beta | rc | stable. If --stage is 'rc' or 'beta', there is no merge of develop into master (if -ref_branch=develop)"
    echo " -i|--stage_iteration=n,          The released version will be : [x].[y].[z]-beta.[n] OR  [x].[y].[z]-rc.[n] according to the given --stage"
 	echo " -ref_branch | --reference_branch From which branch to start the release."
    echo "    Add -ref_branch=develop for a new official release"
    echo "    Add -ref_branch=x.x.x for a maintenance release"
	exit 1
}
STAGE="stable"
TESTS="YES"
IS_LATEST_VERSION="YES"
for i in "$@"
do
case $i in
    -rel=*|--app-release=*)
    APP_REL="${i#*=}"
    shift # past argument=value
    ;;
    -dev=*|--app-dev=*)
    APP_DEV="${i#*=}"
    shift # past argument=value
    ;;
    --no-tests)
    TESTS="NO"
    shift # past argument with no value
    ;;
    --not-latest)
    IS_LATEST_VERSION="NO"
    shift # past argument with no value
    ;;
    -ref_branch=*|--reference_branch=*)
    REF_BRANCH="${i#*=}"
    shift # past argument=value
    ;;
    -s=*|--stage=*)
    STAGE="${i#*=}"
    shift # past argument=value
    ;;
    -i=*|--stage_iteration=*)
    STAGE_ITERATION="${i#*=}"
    shift # past argument=value
    ;;
    *)
      # unknown option
    ;;
esac
done

if [ -z ${REF_BRANCH+x} ];
    then
        echo ""
        echo "###########"
        echo "-ref_branch is missing."
        echo "  Add -ref_branch=develop for a new official release"
        echo "  Add -ref_branch=x.x.x for a maintenance release"
        echo "###########"
        echo ""
        usage;
fi

if [ -z ${STAGE+x} ];
    then
        echo ""
        echo "###########"
        echo "-s=*|--stage* is missing."
        echo "  Add --stage=beta|rc|stable to define the release stage"
        echo "###########"
        echo ""
        usage;
fi

if [ "${STAGE}" != "beta" ] && [ "${STAGE}" != "rc" ] && [ "${STAGE}" != "stable" ];
    then
        echo ""
        echo "###########"
        echo "Stage ${STAGE} is invalid."
        echo "  Add --stage=beta|rc|stable to define the release stage"
        echo "###########"
        echo ""
        usage;
fi

if [ "${STAGE}" == "beta" ] || [ "${STAGE}" == "rc" ];
    then
        if [ -z ${STAGE_ITERATION+x} ];
            then
                echo ""
                echo "###########"
                echo "You chose to release this version as ${STAGE}."
                echo "--stage_iteration is missing."
                echo "  Add -i=n|--stage_iteration=n, the released version will be : [x].[y].[z]-${STAGE}.[n]"
                echo "###########"
                echo ""
                usage;
        fi
fi

VERSION="${APP_REL}"
DEV="${APP_DEV}"

echo "==> Get ${REF_BRANCH} branch"
git checkout "${REF_BRANCH}"
git pull origin "${REF_BRANCH}"

if [ "$TESTS" == "YES" ]; then
  ng lint
  ng test
  ng e2e
else
  echo "==> Skip tests"
fi

if [ "${STAGE}" == "rc" ] || [ "${STAGE}" == "beta" ];
    then
        VERSION="${APP_REL}-${STAGE}.${STAGE_ITERATION}"
fi

echo "==> Set version"
npm --no-git-tag-version version ${VERSION}
git add package.json

echo "  -- Create and push tag"
git tag -a v${VERSION} -m "Release prod version ${VERSION}"
git push origin v${VERSION}

echo "==> Generate CHANGELOG"
docker run -it --rm -v "$(pwd)":/usr/local/src/your-app gisaia/github-changelog-generator:latest github_changelog_generator \
  -u gisaia -p ARLAS-wui-iam --token ${GITHUB_CHANGELOG_TOKEN} --no-pr-wo-labels --no-issues-wo-labels --no-unreleased \
  --issue-line-labels conf,documentation \
  --exclude-labels type:duplicate,type:question,type:wontfix,type:invalid \
  --bug-labels type:bug --enhancement-labels type:enhancement --breaking-labels type:breaking \
  --enhancement-label "**New stuff:**" --issues-label "**Miscellaneous:**"

echo "  -- Remove tag to add generated CHANGELOG"
git tag -d v${VERSION}
git push origin :v${VERSION}

echo "  -- Commit release version"
git commit -a -m "Release prod version ${VERSION}"


echo "==> Docker"
docker build --no-cache --build-arg version=${VERSION} --tag gisaia/arlas-wui-iam:${VERSION} .

docker push gisaia/arlas-wui-iam:${VERSION}


if [ "${STAGE}" == "stable" ] && [ "${IS_LATEST_VERSION}" == "YES" ];
    then
    docker tag gisaia/arlas-wui-iam:${VERSION} gisaia/arlas-wui-iam:latest
    docker push gisaia/arlas-wui-iam:latest
fi

git tag v${VERSION}
git push origin v${VERSION}
git push origin ${REF_BRANCH}

if [ "${REF_BRANCH}" == "develop" ] && [ "${STAGE}" == "stable" ];
    then
    echo "==> Merge develop into master"
    git checkout master
    git pull origin master
    git merge origin/develop
    git push origin master

    git checkout develop
    git pull origin develop
    git rebase origin/master
fi

npm --no-git-tag-version version "${DEV}-dev"

git commit -a -m "Set development version to ${DEV}-dev"
git push origin ${REF_BRANCH}

echo "==> Well done :)"
