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

import com.google.inject.Provider;
import com.google.inject.servlet.ServletModule;
import java.util.Arrays;
import javax.websocket.DeploymentException;
import javax.websocket.server.ServerContainer;
import javax.websocket.server.ServerEndpointConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Loads the JSR-356 WebSocket tunnel implementation.
 */
public class ExampleWebSocketTunnelModule extends ServletModule implements TunnelLoader {

    /**
     * Logger for this class.
     */
    private final Logger logger = LoggerFactory.getLogger(ExampleWebSocketTunnelModule.class);

    @Override
    public boolean isSupported() {

        try {

            // Attempt to find WebSocket servlet
            Class.forName("javax.websocket.Endpoint");

            // Support found
            return true;

        }

        // If no such servlet class, this particular WebSocket support
        // is not present
        catch (ClassNotFoundException e) {}
        catch (NoClassDefFoundError e) {}

        // Support not found
        return false;
        
    }
    
    @Override
    public void configureServlets() {

        logger.info("Loading JSR-356 WebSocket support...");

        // Get container
        ServerContainer container = (ServerContainer) getServletContext().getAttribute("javax.websocket.server.ServerContainer"); 
        if (container == null) {
            logger.warn("ServerContainer attribute required by JSR-356 is missing. Cannot load JSR-356 WebSocket support.");
            return;
        }

        // Build configuration for WebSocket tunnel
        System.out.println("setting up endpoint 1");
        ServerEndpointConfig config =
                ServerEndpointConfig.Builder.create(ExampleGuacamoleWebSocketTunnelEndpoint.class, "/websocket-tunnel")
                                            .configurator(new ExampleGuacamoleWebSocketTunnelEndpoint.Configurator())
                                            .subprotocols(Arrays.asList(new String[]{"guacamole"}))
                                            .build();

        try {

            // Add configuration to container
            System.out.println("setting up endpoint 2");
            container.addEndpoint(config);
            System.out.println("setting up endpoint 3");
        }
        catch (DeploymentException e) {
            System.out.println("setting up endpoint error");
            logger.error("Unable to deploy WebSocket tunnel.", e);
        }

    }

}
