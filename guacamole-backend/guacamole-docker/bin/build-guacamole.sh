#!/bin/sh -e
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#

##
## @fn build-guacamole.sh
##
## Builds Guacamole, saving "guacamole.war" and all applicable extension .jars
## using the guacamole-client source contained within the given directory.
## Extension files will be grouped by their associated type, with all MySQL
## files being placed within the "mysql/" subdirectory of the destination, all
## PostgreSQL files being placed within the "postgresql/" subdirectory of the
## destination, etc.
##
## @param BUILD_DIR
##     The directory which currently contains the guacamole-client source and
##     in which the build should be performed.
##
## @param DESTINATION
##     The directory to save guacamole.war within, along with all extension
##     .jars.  Note that this script will create extension-specific
##     subdirectories within this directory, and files will thus be grouped by
##     extension type.
##
## @param BUILD_PROFILE
##     The build profile that will be passed to Maven build process. Defaults
##     to empty string. Can be set to "lgpl-extensions" to e.g. include
##     RADIUS authentication extension.
##

BUILD_DIR="$1"
DESTINATION="$2"
BUILD_PROFILE="$3"

#
# Create destination, if it does not yet exist
#

mkdir -p "$DESTINATION"

#
# Build guacamole.war and all extensions
#

cd "$BUILD_DIR"

if [ -z "$BUILD_PROFILE" ]; then
    mvn package
else
    mvn -P "$BUILD_PROFILE" package
fi

#
# Copy guacamole.war to destination
#

cp target/*.war "$DESTINATION/guacamole.war"
