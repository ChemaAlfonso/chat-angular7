import { Injectable } from '@angular/core';

// Firestore
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

// FireAuth
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

// Rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interfaces
import { Mensaje } from '../interfaces/mensaje';



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe( user => {
      console.log('Estado del usuario', user);

      if ( !user ){
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  login( provider: string ) {

    if ( provider == 'google'){
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    } else {
      this.afAuth.auth.signInWithPopup(new auth.GithubAuthProvider());

    }
  }
  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes(){

    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc')
                                                                           .limit(5));

    return this.itemsCollection.valueChanges()
                               .pipe(map( (mensajes: Mensaje[]) => {
                                 console.log(mensajes);

                                 this.chats = [];

                                 for (let mensaje of mensajes){
                                   this.chats.unshift( mensaje );
                                 }


                                 return this.chats;
                               }));

  }

  agregarMensaje( texto: string ){
    
    // TODO falta uid
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }

    return this.itemsCollection.add( mensaje );

  }
}
