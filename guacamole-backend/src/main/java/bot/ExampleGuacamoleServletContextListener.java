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

import com.google.inject.Guice;
import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.Stage;
import com.google.inject.servlet.GuiceServletContextListener;
import java.util.List;
import javax.servlet.ServletContextEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A ServletContextListener to listen for initialization of the servlet context
 * in order to set up dependency injection.
 */
public class ExampleGuacamoleServletContextListener extends GuiceServletContextListener {

    /**
     * Logger for this class.
     */
    private final Logger logger = LoggerFactory.getLogger(ExampleGuacamoleServletContextListener.class);

    /**
     * The Guacamole server environment.
     */

    @Override
    protected Injector getInjector() {

        // Create injector
        Injector injector = Guice.createInjector(Stage.PRODUCTION,
            new ExampleWebSocketTunnelModule()
        );

        // Inject any annotated members of this class
        injector.injectMembers(this);

        return injector;

    }

}
