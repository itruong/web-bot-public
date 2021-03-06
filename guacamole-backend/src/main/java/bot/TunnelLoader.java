/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package bot;

import com.google.inject.Module;

/**
 * Generic means of loading a tunnel without adding explicit dependencies within
 * the main ServletModule, as not all servlet containers may have the classes
 * required by all tunnel implementations.
 */
public interface TunnelLoader extends Module {

    /**
     * Checks whether this type of tunnel is supported by the servlet container.
     * 
     * @return true if this type of tunnel is supported and can be loaded
     *         without errors, false otherwise.
     */
    public boolean isSupported();

}
