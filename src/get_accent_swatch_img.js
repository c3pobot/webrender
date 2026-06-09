import log from './logger.js'
import discordEmbedColors from './discord_embed_color.js'

function getRGBvalue(int){
  if(!int) return
  return `#${int.toString(16).padStart(6, '0')}`
}
export default function(){
  try{
    let html = `<html>
                <head>
                <style>
                  body {
                    background-color: black;
                    color: white;
                    margin: 0;
                    padding: 0;
                  }
                  .color-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
                    font-size: 14px;
                  }
                  .color-table th, .color-table td {
                    border: 1px solid rgba(0,0,0,0.12);
                    padding: 8px 10px;
                    text-align: left;
                  }
                  .color-table thead th {
                    background: #f4f5f7;
                    font-weight: 600;
                  }
                  .swatch {
                    width: 64px;
                    min-width: 64px;
                    border-radius: 6px;
                  }
                </style>
                </head>
                <body>
                <table class="color-table">
                  <thread>
                    <tr><th width="25%">Name</th><th>Swatch</th></tr>
                  </thead>
                  <tbody>`
                for(let c of discordEmbedColors) html += `<tr><td>${c.name}</td><td class="swatch" style="background:${getRGBvalue(c.value)}"/></tr>`
                html += `</tbody>
                        </table>
                        </body>
                        </html>`
      return html
  }catch(e){
    log.error(e)
  }
}
