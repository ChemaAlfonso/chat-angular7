import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  mensaje: string = '';
  elm: any;

  constructor( public _chatservice: ChatService ) {
    this._chatservice.cargarMensajes()
          .subscribe( () => {

            // Timeout para que ejecutar a destiempo y que funcione al recargar
            setTimeout( () => {
              this.elm.scrollTop = this.elm.scrollHeight;
            }, 20);

          });
   }

  ngOnInit() {

    this.elm = document.getElementById('app-mensajes');

  }

  enviarMensaje(){
    console.log(this.mensaje);

    if (this.mensaje.length === 0 ){
      return;
    }

    this._chatservice.agregarMensaje( this.mensaje )
          .then( () => this.mensaje = '' )
          .catch( (err) => console.error('Error al enviar', err) );
  }

}
