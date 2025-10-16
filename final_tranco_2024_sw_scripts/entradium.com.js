<!DOCTYPE html>
<html>
  <head>
    <title>Actualiza tu navegador</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
    <style>
      body{
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        font: normal normal 400 normal 16px / 24px "Lato", sans-serif;
      }
      #fondo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        position: absolute;
        background: #dd5427 padding-box border-box;
      }
      #popup {
        display: flex;
        flex-direction: column;
        box-shadow: rgba(0, 0, 0, 0.27) 0px 0px 73px 0px;
        box-sizing: border-box;
        color: rgb(51, 51, 51);
        width: 650px;
        position: absolute;
        background: white;
        text-align: center;
        text-size-adjust: 100%;
        padding: 50px;
        text-align: justify;
      }

      @media (max-width: 480px) {
        #popup{
          width: 100%;
          height: 100%;
          left: auto;
          top: auto;
          margin: auto;
        }
      }

      #popup p{
        flex-grow: 1;
        text-align: center;
      }

      p.small {
        font-size: 8px;
      }

      #popup .error{
        text-align: center;
        color: rgb(170, 170, 170);
        line-height: 1;
        font-size: 48px;
      }#popup a{
        /*background-color: #1a1a1a;*/
        border: none;
        color: #1a1a1a;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: block;
        font-size: 16px;
        bottom: 0;
      }
      /* IE9, IE10, IE11 */
      @media screen and (min-width:0\0) {
          #popup { 
            top: 50%;
            left: 50%;
            margin-left: -325px;
            margin-top: -300px;
          }
      }
    </style>
  </head>

  <body>
    <div id="fondo">
      <div id="popup">
        <div class="error">¡Ups! No podemos mostrarte esta página</div>
        <p>Tu navegador no está actualizado y por motivos de seguridad no podemos mostrarte esta página.</p>
        <p>
          Para poder acceder utiliza otro navegador que tengas instalado en tu dispositivo o descarga la última versión del navegador en estos enlaces:
          <table style="margin: 0 auto;width: 100%;">
            <tbody>
              <th>
                <td style="text-align: center;"><a target="_blank" href="https://www.google.com/chrome/" title="chrome"><img src="/chrome.png" alt="chrome" height="42" width="42"><br>Chrome</a></td>
                <td style="text-align: center;"><a target="_blank" href="https://www.mozilla.org/firefox/new/" title="firefox"><img src="/firefox.png" alt="firefox" height="42" width="42"><br>Firefox</a></td>
                <td style="text-align: center;"><a target="_blank" href="https://www.microsoft.com/windows/microsoft-edge" title="edge"><img src="/edge.png" alt="edge" height="42" width="42"><br>Edge</a></td>
              </th>
            </tbody>
          </table>
        </p>
        
      </div>
    </div>
  </body>
</html>
