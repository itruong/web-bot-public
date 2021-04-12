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
import java.util.Map;
import javax.websocket.EndpointConfig;
import javax.websocket.HandshakeResponse;
import javax.websocket.Session;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;
import org.apache.guacamole.GuacamoleException;
import org.apache.guacamole.net.GuacamoleSocket;
import org.apache.guacamole.net.GuacamoleTunnel;
import org.apache.guacamole.net.InetGuacamoleSocket;
import org.apache.guacamole.net.SimpleGuacamoleTunnel;
import org.apache.guacamole.protocol.ConfiguredGuacamoleSocket;
import org.apache.guacamole.protocol.GuacamoleConfiguration;
import org.apache.guacamole.websocket.GuacamoleWebSocketTunnelEndpoint;

/**
 * Tunnel implementation which uses WebSocket as a tunnel backend, rather than
 * HTTP, properly parsing connection IDs included in the connection request.
 */
public class ExampleGuacamoleWebSocketTunnelEndpoint extends GuacamoleWebSocketTunnelEndpoint {

    /**
     * Unique string which shall be used to store the TunnelRequest
     * associated with a WebSocket connection.
     */
    private static final String TUNNEL_REQUEST_PROPERTY = "WS_GUAC_TUNNEL_REQUEST";

    /**
     * Unique string which shall be used to store the TunnelRequestService to
     * be used for processing TunnelRequests.
     */
    private static final String TUNNEL_REQUEST_SERVICE_PROPERTY = "WS_GUAC_TUNNEL_REQUEST_SERVICE";

    /**
     * Configurator implementation which stores the requested GuacamoleTunnel
     * within the user properties. The GuacamoleTunnel will be later retrieved
     * during the connection process.
     */
    public static class Configurator extends ServerEndpointConfig.Configurator {

        /**
         * Provider which provides instances of a service for handling
         * tunnel requests.
         */
        // private final Provider<TunnelRequestService> tunnelRequestServiceProvider;
         
        // /**
        //  * Creates a new Configurator which uses the given tunnel request
        //  * service provider to retrieve the necessary service to handle new
        //  * connections requests.
        //  * 
        //  * @param tunnelRequestServiceProvider
        //  *     The tunnel request service provider to use for all new
        //  *     connections.
        //  */
        // public Configurator(Provider<TunnelRequestService> tunnelRequestServiceProvider) {
        //     this.tunnelRequestServiceProvider = tunnelRequestServiceProvider;
        // }
        
        @Override
        public void modifyHandshake(ServerEndpointConfig config,
                HandshakeRequest request, HandshakeResponse response) {

            super.modifyHandshake(config, request, response);
        }
        
    }
    
    @Override
    protected GuacamoleTunnel createTunnel(Session session,
            EndpointConfig endpointConfig) throws GuacamoleException {

        try {
            // Create our configuration
            GuacamoleConfiguration config = new GuacamoleConfiguration();
            config.setProtocol("vnc");
            // TODO: implement additional security
            config.setParameter("hostname", session.getQueryString());
            config.setParameter("port", "5900");
            config.setParameter("password", "secret");

            // Connect to guacd - everything is hard-coded here.
            GuacamoleSocket socket = new ConfiguredGuacamoleSocket(
                    new InetGuacamoleSocket("guacd", 4822),
                    config
            );

            // Return a new tunnel which uses the connected socket
            return new SimpleGuacamoleTunnel(socket);
        } catch(Exception e){
            System.out.println(e.getMessage());
            return null;
        }

    }

}
