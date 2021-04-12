package bot;

import javax.servlet.http.HttpServletRequest;
import org.apache.guacamole.GuacamoleException;
import org.apache.guacamole.net.GuacamoleSocket;
import org.apache.guacamole.net.GuacamoleTunnel;
import org.apache.guacamole.net.InetGuacamoleSocket;
import org.apache.guacamole.net.SimpleGuacamoleTunnel;
import org.apache.guacamole.protocol.ConfiguredGuacamoleSocket;
import org.apache.guacamole.protocol.GuacamoleConfiguration;
import org.apache.guacamole.servlet.GuacamoleHTTPTunnelServlet;


public class ExampleGuacamoleHTTPTunnelServlet
    extends GuacamoleHTTPTunnelServlet {

    @Override
    protected GuacamoleTunnel doConnect(HttpServletRequest request)
        throws GuacamoleException {

        // logger.debug("just testing shit out.");

        System.out.println("asdfasdf");

        try {
            // Create our configuration
            GuacamoleConfiguration config = new GuacamoleConfiguration();
            config.setProtocol("vnc");
            config.setParameter("hostname", "selenium-node");
            // config.setParameter("hostname", request.getParameter("hostname"));
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