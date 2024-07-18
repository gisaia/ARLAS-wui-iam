fetchSettings(){
  echo "Download settings file from \"${ARLAS_IAM_SETTINGS_URL}\" ..."
  curl ${ARLAS_IAM_SETTINGS_URL} -o /usr/share/nginx/html/settings.yaml && echo "settings.yaml file downloaded with success." || (echo "Failed to download the settings.yaml file."; exit 1)
}

### URL to SETTINGS
if [ -z "${ARLAS_IAM_SETTINGS_URL}" ]; then
  echo "The default settings.yaml file is used"
else
  fetchSettings;
fi


# Set App base path
if [ -z "${ARLAS_WUI_IAM_APP_PATH}" ]; then
  ARLAS_WUI_IAM_APP_PATH=""
  export ARLAS_WUI_IAM_APP_PATH
  echo "No specific path for the app"
else
  echo ${ARLAS_WUI_IAM_APP_PATH}  "is used as app base path "
fi

envsubst '$ARLAS_WUI_IAM_APP_PATH' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Set App base href
if [ -z "${ARLAS_WUI_IAM_BASE_HREF}" ]; then
  ARLAS_WUI_IAM_BASE_HREF=""
  export ARLAS_WUI_IAM_BASE_HREF
  echo "No specific base href for the app"
else
  echo ${ARLAS_WUI_IAM_BASE_HREF}  "is used as app base href "
fi

envsubst '$ARLAS_WUI_IAM_BASE_HREF' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

### Array of statics links
if [ -z "${ARLAS_STATIC_LINKS}" ]; then
  ARLAS_STATIC_LINKS="[]"
  export ARLAS_STATIC_LINKS
  echo "None static link is defined"
else
  echo ${ARLAS_STATIC_LINKS} "is used for 'links' in settings.yaml file"
fi
envsubst '$ARLAS_STATIC_LINKS' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

## AUTHENTICATION
### ARLAS_USE_AUTHENT
if [ -z "${ARLAS_USE_AUTHENT}" ]; then
  ARLAS_USE_AUTHENT=false
  export ARLAS_USE_AUTHENT
  echo "No Authentication variable is set"
else
  echo ${ARLAS_USE_AUTHENT} "is used for 'authentication.use_authent'. Default value is 'false'"
fi
envsubst '$ARLAS_USE_AUTHENT' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_MODE
if [ -z "${ARLAS_AUTHENT_MODE}" ]; then
  ARLAS_AUTHENT_MODE='iam'
  export ARLAS_AUTHENT_MODE
  echo "Default auth.mod: 'iam' "
else
  echo ${ARLAS_AUTHENT_MODE} "is used for 'authentication.auth_mode'. Default value is 'iam'"
fi
envsubst '$ARLAS_AUTHENT_MODE' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### THRESHOLD
if [ -z "${ARLAS_AUTHENT_THRESHOLD}" ]; then
  ARLAS_AUTHENT_THRESHOLD=60000
  export ARLAS_AUTHENT_THRESHOLD
  echo "Default threshold: 60000"
else
  echo ${ARLAS_AUTHENT_THRESHOLD} "is used for 'authentication.threshold'. Default value is '60000'"
fi
envsubst '$ARLAS_AUTHENT_THRESHOLD' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_IAM_SERVER_URL
if [ -z "${ARLAS_IAM_SERVER_URL}" ]; then
  ARLAS_IAM_SERVER_URL="http://localhost:9997"
  export ARLAS_IAM_SERVER_URL
  echo "Default url : http://localhost:9997"
else
  echo ${ARLAS_IAM_SERVER_URL} "is used for 'authentication.url'."
fi
envsubst '$ARLAS_IAM_SERVER_URL' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml


### ARLAS_AUTHENT_SIGN_UP_ENABLED
if [ -z "${ARLAS_AUTHENT_SIGN_UP_ENABLED}" ]; then
  ARLAS_AUTHENT_SIGN_UP_ENABLED=false
  export ARLAS_AUTHENT_SIGN_UP_ENABLED
  echo "No Authentication sign_up_enabled variable is set. Default value is 'false'"
else
  echo ${ARLAS_AUTHENT_SIGN_UP_ENABLED} "is used for 'authentication.sign_up_enabled'"
fi
envsubst '$ARLAS_AUTHENT_SIGN_UP_ENABLED' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

nginx -g "daemon off;"
