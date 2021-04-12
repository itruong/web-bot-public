import Guacamole from 'guacamole-common-js';


export const scrollTo = (href) => {
  document.querySelector(href).scrollIntoView({
    behavior: "smooth",
  });
};

export const connect_display = () => {

    // Get display div from document
    var display = document.getElementById("display");

    // Instantiate client, using an HTTP tunnel for communications.
    var guac = new Guacamole.Client(
        new Guacamole.HTTPTunnel("tunnel")
    );

    // Add client to display div
    display.appendChild(guac.getDisplay().getElement());
    
    // Error handler
    guac.onerror = function(error) {
        console.log(error)
        // alert(error);
    };

    // Connect
    guac.connect();

    // Disconnect on close
    window.onunload = function() {
        guac.disconnect();
    }
}


