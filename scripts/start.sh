#!/bin/sh
set -o errexit -o pipefail

# Set the default value for an environment variable if not already set
set_default_env_variable() {
    VARIABLE_NAME=$1
    VARIABLE_VALUE=$2
    CURRENT_VALUE=$(eval "echo \$$VARIABLE_NAME")
    if [ -z "$CURRENT_VALUE" ]; then
        eval "$VARIABLE_NAME=\"$VARIABLE_VALUE\""
        export "$VARIABLE_NAME"
        echo "Set $VARIABLE_NAME to '$(eval "echo \$$VARIABLE_NAME")'."
    else
        echo "$VARIABLE_NAME is already set to '$CURRENT_VALUE', not overriding."
    fi
}

fetchSettings() {
  echo "Download settings file from \"${ARLAS_IAM_SETTINGS_URL}\" ..."
  curl ${ARLAS_IAM_SETTINGS_URL} -o /usr/share/nginx/html/settings.yaml && echo "settings.yaml file downloaded with success." || (echo "Failed to download the settings.yaml file."; exit 1)
}

### URL to SETTINGS
if [ -z "${ARLAS_IAM_SETTINGS_URL}" ]; then
  echo "The default settings.yaml file is used"
else
  fetchSettings;
fi

# Initialize environment variables using set_default_env_variable
set_default_env_variable ARLAS_WUI_IAM_APP_PATH ""
set_default_env_variable ARLAS_WUI_IAM_BASE_HREF ""
set_default_env_variable ARLAS_STATIC_LINKS "[]"

set_default_env_variable ARLAS_USE_AUTHENT "false"
set_default_env_variable ARLAS_AUTHENT_MODE "iam"
set_default_env_variable ARLAS_AUTHENT_THRESHOLD 60000
set_default_env_variable ARLAS_IAM_SERVER_URL "http://localhost:9997"
set_default_env_variable ARLAS_AUTHENT_SIGN_UP_ENABLED "false"

# All variables that need to be substituted in settings.yaml
SETTINGS_VARS="ARLAS_STATIC_LINKS
  ARLAS_USE_AUTHENT
  ARLAS_AUTHENT_MODE
  ARLAS_AUTHENT_THRESHOLD
  ARLAS_IAM_SERVER_URL
  ARLAS_AUTHENT_SIGN_UP_ENABLED"

SETTINGS_SUBST=$(printf '$%s ' $SETTINGS_VARS)
envsubst "$SETTINGS_SUBST" < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
truncate -s 0 /usr/share/nginx/html/settings.yaml
cat /usr/share/nginx/html/settings.yaml.tmp >> /usr/share/nginx/html/settings.yaml

# Variables to substitute in index.html
INDEX_VARS="ARLAS_WUI_IAM_BASE_HREF"

INDEX_SUBST=$(printf '$%s ' $INDEX_VARS)
envsubst "$INDEX_SUBST" < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
cat /usr/share/nginx/html/index.html.tmp > /usr/share/nginx/html/index.html

# Variables to substitute in nginx default.conf
NGINX_VARS="ARLAS_WUI_IAM_APP_PATH"

NGINX_SUBST=$(printf '$%s ' $NGINX_VARS)
envsubst "$NGINX_SUBST" < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
cat /etc/nginx/conf.d/default.conf.tmp > /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"
