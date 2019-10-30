import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Cookies from 'js-cookie';
import { getval,getkryterium, PokazAll, ReklamacjaIndy } from './pobierz_tabele.js';
import * as serviceWorker from './serviceWorker';
import $ from 'jquery';
import Popup from './functions.js';
import ModalImage from "react-modal-image";

//Cookies.remove("log_auth");
//console.log(Cookies.get("log_auth"));

class FileUpload extends React.Component{
  
  constructor(props){
      super(props);
      this.state={
          selectedFile:null,
          ile:0,
          lista:"",
       }
      this.handleSubmitFile=this.handleSubmitFile.bind(this);
      this.handleRemove=this.handleRemove.bind(this);
  }

  async handleRemove(){
    await this.setState({
      selectedFile:null,
      ile:0,
      lista:"",
      })
  data= new FormData();
  }
  async handleSubmitFile(e) {
          await this.setState({
          selectedFile:e.target.files,
          })
          for(var x=0;x<this.state.selectedFile.length;x++){
                let rozszerzenie=this.state.selectedFile[x].name.split(".").pop();
                if(rozszerzenie.toUpperCase()==='PNG' || rozszerzenie.toUpperCase()==='JPEG' || rozszerzenie.toUpperCase()==='PDF' || rozszerzenie.toUpperCase()==='JPG')
                    {
                      data.append('images[]',this.state.selectedFile[x]);
                      if (this.state.lista.includes(this.state.selectedFile[x].name)){
                      }
                  else{await this.setState({
                      ile:this.state.ile+1,
                      lista:this.state.lista+this.state.selectedFile[x].name+"\n",
                  })
                  ;}
                }
                else{
                      alert("Błędny format pliku, proszę przesyłać tylko PNG, PDF oraz JPG/JPEG");
                      return;
                }  
              }
  }

  render(){
      return(
          <div method="POST" className="form-horizontal" id="upload" encType="multipart/form-data"   >
              <br/>    
              <div className="form-row centruj2 ">
                <div className="form-group col-md-6"> 
                  <input type="file" style={{display:"none"}} onChange={this.handleSubmitFile} multiple name="file" id="image" accept="application/pdf, image/*" /> 
                  <label className="fileupdate" htmlFor="image">Wybierz pliki<h6>Tylko PDF, PNG, JPG/JPEG</h6></label><br/>
                    <Hover tekst={" Ilość wgranych zdjęć:"+this.state.ile} hint={this.state.lista}/>
                </div>
                  <div className="form-group col-md-6 ">
                    <button type="button" className="fileupdate" onClick={this.handleRemove}>Usuń pliki z wyboru</button>
                 </div>
            </div>
        </div>
      )
  }
}
var data=new FormData();
class Hover extends React.Component{
  render(){
    return(
      <label className='dohovera' htmlFor="inputdokument">{this.props.tekst}<span className="hoveruje">{this.props.hint}</span></label>
    )
  }
}

class Wylogowanie extends React.Component{
  constructor(props){
    super(props);
    this.state={

    }
    this.wyloguj=this.wyloguj.bind(this);
  }
  wyloguj() {
    Cookies.remove('log_auth');
    Cookies.remove("zalogowany");
    sessionStorage.setItem('tab','x');
    this.props.handlelogged(false);
    window.location.reload();
  }
 
  render(){
    return(
      <input className='logout' type='button' onClick={this.wyloguj} value="Wyloguj się"></input>
    )
  }
}

class Logowanie extends React.Component{
  constructor(props){
    super(props);
    this.state={
      imie: "",
      haslo: "",
    }
    
    this.handleSubmitLog=this.handleSubmitLog.bind(this);
  }
  
  
   async handleSubmitLog(e) {
    e.preventDefault();
    /*Zdefiniowanie zdarzenia inicjującego 
   - kliknięcie przycisku wyślij*/
    //zmienne pobrane z formularza
    var imie = $('#inputlogin').val();
    var haslo = $('#inputhaslo').val();
    this.setState({kto:imie});
     fetch("http://localhost/system_reklamacji/php/zaloguj.php", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'klucz_login': imie,
        'klucz_haslo': haslo

      })
    }).then((response) => {
      if (response) {  
        console.log();
        
        
        
        
        return response.json();
        
      } else {
        throw new Error('Something went wrong');
      }
    }).then(json => json ?  (this.ustawCiasteczka(json),this.props.handlelogged(true),
        sessionStorage.setItem('tab','moje'),window.location.reload()) : null ).catch((error) => {
      //alert(error);
     alert("Błędne dane! Sprawdź czy dane są poprawne")
    });
     
    // .then(json =>this.zaloguj(json))
  }

  ustawCiasteczka=(e)=>{
    Cookies.set("log_auth", e[0][0]);
    Cookies.set("zalogowany", e[0][1]);
  }

  handleChangeLog = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

render(){
  return(
    <div className="srodek ">
    <form className='relat' onSubmit={this.handleSubmitLog} >
          <div className='col-md-12'><div className='form-row'  >
          <div className='form-group col-md-12'><label htmlFor="inputEmail4"><h2>Logowanie</h2><h4> do panelu zarządzania reklamacjami</h4></label>
              
            </div>

            <div className='form-group col-md-12'><label htmlFor="inputEmail4">Login</label>
              <input type="text" name='imie' value={this.state.imie} required onChange={e => this.handleChangeLog(e)} className="form-control" id="inputlogin" />
            </div><div className='form-group col-md-12'><label htmlFor="inputEmail4">Hasło</label>
              <input type="password" name='haslo' value={this.state.haslo} required onChange={e => this.handleChangeLog(e)} className="form-control" id="inputhaslo" />
            </div><div className='form-group col-md-12'><input id="wyslij" type="submit" value="Zaloguj się" className="fileupdate" />
            </div>
            <label className='form-group col-md-1' ></label>
          </div></div> </form></div>
  )
}

}

class AppFooter extends React.Component{
  
  render(){
    return(
      <div className='wraper'>
        <div className='footer'></div>
      </div>
    )
  }
}


class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "",
      zalogowany:false,
      update:false,
      kto:''
    }
    this.handleParentlogged=this.handleParentlogged.bind(this);
    
  }
  
  // handleParentLogged = async (e) => {
  //   await console.log(this.state.zalogowany);
  //   await this.setState({ zalogowany: e });
  //   await console.log(this.state.zalogowany);
  // }
  // handleParentLogout = async (e) => {
  //   await console.log(this.state.zalogowany);
  //   await this.setState({ zalogowany: e });
  //   await console.log(this.state.zalogowany);
  // }
  
  
  handleClick = async (e) => {
    let ifexist;
    this.setState({tab:e.target.attributes.tab.value});
    e.preventDefault();
    
    if (Cookies.get("log_auth") === null ) {
      
      ifexist = "x";
      await this.props.handleData("formularz");
      
      
    }
    else {
      
      ifexist = 
      fetch("http://localhost/system_reklamacji/php/check_cookie.php", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'klucz_cookie': Cookies.get("log_auth"),
        })
      }).then(res => res.json()).then(json => (json[0][5] ? "YAY" : "NAY")).catch( (error) => {
        //alert("nie masz dostępu");
         this.props.handleData("formularz");
         Cookies.remove('log_auth');
      });
      
      await this.props.handleData(e.target.attributes.tab.value);
      
    }
    
    

  }



handleParentlogged = async (e) => {
      await this.setState({ islogged: e});
      console.log(this.state.islogged);
    }

  render() {
    return (
      <div>
        <div className="col-md-12 padding-top">
          
  <div className="row"><div className="form-group col-md-6">
      <img class="logo" title="Ciepło. Wentylacja. Życie." alt="Ciepło. Wentylacja. Życie."
       src="https://www.schiedel.com/wp-content/custom/schiedel-logo-2019.svg"/>
        </div>
         <div className="form-group col-md-6 ">
         <div className="row wprawo " >
         <div className="col-md-12">
         <div className="form-group col-md-12">
            {(!Cookies.get("log_auth") && (this.state.zalogowany)!==null?null:<h1 >Witaj {Cookies.get("zalogowany")}
         </h1>)}<hr className="hrstyle"/>
         
            {(!Cookies.get("log_auth") && !Cookies.get("zalogowany") && (this.state.zalogowany)!==null?null:<Wylogowanie handlelogged={this.handleParentlogged}/>)}
          </div> 
         </div>
          </div></div>
          

        </div>
      

      </div>
      <div className='row'> 
        
      {(!Cookies.get("log_auth") && !Cookies.get("zalogowany") && (this.state.zalogowany)!==null?<Logowanie   handlelogged={this.handleParentlogged}/>:null)}
        {(!Cookies.get("log_auth") && (this.state.zalogowany)!==null?null:
        <div className='col-md-12'>
          {(Cookies.get("log_auth") === null)?null:<div className='form-row' >
          <div className='form-group col-md-3'><a className={"btn shadow-none nakladka btn-"+(
            this.state.tab==='formularz' && this.state.tab!==''?"success":
            (this.state.tab==='' && sessionStorage.getItem("tab")==="formularz"?"success":"info"
            ))+" btn-block"} tab='formularz' onClick={this.handleClick} href={this.state.tab}>Formularz zgłoszeniowy</a></div>
          <div className='form-group col-md'><a className={"btn shadow-none nakladka btn-"+(
            this.state.tab==='nieprzypisane' && this.state.tab!==''?"success":
            (this.state.tab==='' && sessionStorage.getItem("tab")==="nieprzypisane"?"success":"info"
            ))+" btn-block"} tab="nieprzypisane" onClick={this.handleClick} href={this.state.tab}>Reklamacje nieprzypisane</a></div>
          <div className='form-group col-md'><a className={"btn  shadow-none nakladka btn-"+(
            this.state.tab==='moje' && this.state.tab!==''?"success":
            (this.state.tab==='' && sessionStorage.getItem("tab")==="moje"?"success":"info"
            ))+" btn-block"} tab="moje" onClick={this.handleClick} href={this.state.tab}>Moje reklamacje</a></div>
          <div className='form-group col-md'><a className={"btn  shadow-none nakladka btn-"+(
            this.state.tab==='wszystkie' && this.state.tab!==''?"success":
            (this.state.tab==='' && sessionStorage.getItem("tab")==="wszystkie"?"success":"info"
            ))+" btn-block"} tab="wszystkie" onClick={this.handleClick} href={this.state.tab}>Wszystkie reklamacje</a></div>
          <div className='form-group col-md'><a className={"btn  shadow-none nakladka btn-"+(
            this.state.tab==='zakonczone' && this.state.tab!==''?"success":
            (this.state.tab==='' && sessionStorage.getItem("tab")==="zakonczone"?"success":"info"
            ))+" btn-block"} tab="zakonczone" onClick={this.handleClick} href={this.state.tab}>Zakończone</a></div>
        </div>}
        </div>)}</div></div>
    );
  }
}
//
//
let TMP_NR;
class Formularz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imie: '',
      nazwisko: '',
      email: '',
      telefon: '',
      dokument: '',
      firma: '',
      datan: '',
      dataw: '',
      miejscowosc: '',
      kierowca: '',
      dane: '',
      tempi: 1,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.DodajTowar = this.DodajTowar.bind(this);
    this.attach_delete = this.attach_delete.bind(this);
  }
  async DodajTowar() {
    $('.dynamic-element').first().clone().appendTo('.dynamic-stuff').show();
    this.attach_delete();
    await this.setState((prevState, props) => { return { tempi: prevState.tempi + 1, } });
    $('.dynamic-element').last().addClass('towar' + this.state.tempi);
    $('.text-center').last().html("Towar #" + this.state.tempi);
  }
  attach_delete() {
    $('.delete').off();
    $('.delete').click(function () {
      
      $(this).closest('.form-group').remove();
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    /*Zdefiniowanie zdarzenia inicjującego 
   - kliknięcie przycisku wyślij*/
    //zmienne pobrane z formularza
    var imie = $('#inputimie').val();
    var nazwisko = $('#inputnazwisko').val();
    var email = $('#inputemail').val();
    var telefon = $('#inputtelefon').val();
    var dokument = $('#inputdokument').val();
    var firma = $('#inputfirma').val();
    var datan = $('#inputgdate').val();
    var dataw = $('#inputbdate').val();
    var miejscowosc = $('#inputmiejscowosc').val();
    var id_r = "";
    var id_klienta;
    let tempi = this.state.tempi;
    // sprawdzenie czy wszystkie pola są wypełnione
    if (!imie || !nazwisko || !email || !telefon || !dokument   || !dataw || !miejscowosc ) {
      alert("Proszę uzupełnić formularz!");
    }
    else {
      //dodanie klienta do bazy	
      $.ajax({
        type: "POST", /*Informacja o tym, że dane będą wysyłane*/
        url: "http://localhost/system_reklamacji/php/wyslij_klienta.php", /*Informacja, o tym jaki plik będzie przy tym wykorzystywany*/
        dataType: 'text',
        data: { klucz_imie: imie, klucz_nazwisko: nazwisko, klucz_email: email, klucz_telefon: telefon, klucz_firma: firma, }, /*Zdefiniowanie jakie dane będą wysyłane na zasadzie 
              pary klucz-wartość np: wartosc_z_listy_ajax=Polska*/
        /*Działania wykonywane w przypadku sukcesu*/
        success: function () {
          
          //pobranie id klienta
          $.ajax({
            type: "POST", /*Informacja o tym, że dane będą pobierane*/
            url: "http://localhost/system_reklamacji/php/pobierz_uzytkownika.php", /*Informacja, o tym jaki plik będzie przy tym wykorzystywany*/
            dataType: 'text', /*Informacja o formacie transferu danych*/
            data: { klucz_imie: imie, klucz_nazwisko: nazwisko },
            /*Działania wykonywane w przypadku sukcesu*/
            success: function (json) { /*Funkcja zawiera parametr*/
              for (var klucz in json) {
                  var wiersz = json[klucz];  /*Kolejne przebiegi pętli wstawiają nowy klucz*/
                  id_r += wiersz[0];
              }
              //by uzyskac id klienta z formatu [["ID"]]
              id_klienta = (id_r.slice(2, -2));
              
              //definicja tablicy z listą reklamowanych towarów
              var towary = [];
              // wypelnienie tablicy obiektami(1 obiekt to 1 reklamowany towar)
              for (var j = 0; j < tempi; j++) {
                 var reklamacja = {
                    nazwa: $('.towar' + (j + 1) + ' #inputtowar').val(),
                    ilosc: $('.towar' + (j + 1) + ' #inputilosc').val(),
                    przyczyna: $('.towar' + (j + 1) + ' #inputprzyczyna').val()
                };
                towary.push(reklamacja);
                // alert(towary[j].nazwa);
                // alert(towary[j].przyczyna);
                // alert(towary[j].ilosc);
              }
              //wysłanie reklamacji	
              
              fetch("http://localhost/system_reklamacji/php/wyslij_plik.php",{
                        headers:{Accept:"application/json"},
                        method:"POST",
                        body:data,
                    }).then(res=>res.json())
                    .then(json=> $.ajax({
                        type: "POST",
                        url: "http://localhost/system_reklamacji/php/wyslij_reklamacje_trans.php",
                        dataType: 'html',
                        data: {
                          klucz_imie: imie, klucz_nazwisko: nazwisko,klucz_nrrekalamcji:json, klucz_dokument: dokument, klucz_datan: datan, klucz_dataw: dataw,
                          klucz_miejscowosc: miejscowosc, klucz_reklamacje: JSON.stringify(towary), klucz_id: id_klienta, klucz_ile: tempi
                        },
                        success: function () {
                          alert("Reklamacja została wysłana");               },
                        error: function (blad) {
                          alert("Wystąpił błąd z wysłaniem reklamacji"); //wywala funkcje blad mimo tego ze dziala
                          console.log(blad);
                        }
                      })
                      )
             
                    .catch((error) => {
                    // alert(error);
                    
                    });			
              
            },
            //jeżeli nie uda się pobrać id klienta
            error: function (blad) {
              alert("Wystąpił błąd");
              console.log(blad);
            }
          });
        },
        /*Działania wykonywane w przypadku błędu*/
        error: function (blad) {
          alert("Wystąpił błąd");
          console.log(blad); /*Funkcja wyświetlająca informacje 
                      o ewentualnym błędzie w konsoli przeglądarki*/
        }
      });
    }

  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render() {
    return (
      
      <div className="container container-form">
        <div className="form-group dynamic-element" style={{ display: "none" }}>
          <hr className="col-md-12"></hr>
          <div className="row">
            <div className="form-group col-md-12 ">
              <h5 className="text-center"> Towar #{this.state.i}</h5>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-9">
                  <Hover tekst="Numer Materiału" hint="6 do 9 znaków"></Hover>
              <input type="text" pattern=".{6,9}" title="musi zawierać 6-9 znaków" defaultValue="" className="form-control" id="inputtowar" required placeholder="Od 6 do 9 znaków" />
            </div>
            <div className="group col-md-2">
              <label htmlFor="inputPassword4">Ilość</label>
              <input type="number" className="form-control input-form" id="inputilosc" placeholder="ilość" />
            </div>
            <div className="col-md-1">
              <label htmlFor="inputPassword4"></label>
              <p className="form-control delete red " onClick={this.attach_delete}>x</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="exampleFormControlTextarea1">Przyczyna reklamacji</label>
              <textarea className="form-control" id="inputprzyczyna" rows="3"></textarea>
            </div>
          </div>
          <div className="col-md-3">
          </div>
        </div>




        <form onSubmit={this.handleSubmit}  encType="multipart/form-data">
          
          <div className="form-row">
            <div className="form-group col-md-12 centruj2">
              <h1 className='h1-form'>Formularz zgłoszeniowy</h1>
              <h5 className="h5-form">Reklamacja logistyczna</h5>
              
            </div>
            
          </div>
         
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">Imie<s className="red">*</s></label>
              <input type="text" name='imie' value={this.state.imie} required onChange={e => this.handleChange(e)} className="form-control" id="inputimie" placeholder="Imię" />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">Nazwisko<s className="red">*</s></label>
              <input type="text" required name='nazwisko' value={this.state.nazwisko} onChange={e => this.handleChange(e)} className="form-control" id="inputnazwisko" placeholder="Nazwisko" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">Email<s className="red">*</s></label>
              <input type="email" required name='email' value={this.state.email} onChange={e => this.handleChange(e)} className="form-control" id="inputemail" placeholder="Email" />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">Telefon Kontaktowy<s className="red">*</s></label>
              <input type="tel" className="form-control" id="inputtelefon" onChange={e => this.handleChange(e)} name='telefon' value={this.state.telefon} required placeholder="nr telefonu" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputdokument">Dokument<s className="red">*</s></label>
              <input type="text" className="form-control" id="inputdokument" onChange={e => this.handleChange(e)} required name='dokument' value={this.state.dokument} placeholder="Dokument dostawy/FV" />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">Nazwa firmy<s  className="red"></s></label>
              <input type="text" className="form-control" id="inputfirma" onChange={e => this.handleChange(e)} name='firma' value={this.state.firma}  placeholder="(opcjonalne)" />
            </div>
          </div>
          <div className="form-row">
           <div className="form-group col-md-6">
              <label htmlFor="inputdokument">Miejscowość<s className="red">*</s></label>
              <input type="text" className="form-control" id="inputmiejscowosc" onChange={e => this.handleChange(e)} required name='miejscowosc' value={this.state.miejscowosc} placeholder="Miejscowość" />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">Data stwierdzenia wady<s className="red">*</s></label>
              <input type="date" className="form-control" id="inputbdate" onChange={e => this.handleChange(e)} name='dataw' value={this.state.dataw} required placeholder="DD-MM-RRRR" />
            </div>
          </div>
          <div className="form-row">
            
            <div className="form-group col-md-6">
             
              
            </div>
            <hr className="col-xs-12"></hr>
          </div>
          <div className="form-row">
            <div className="form-group col-md-12">
              <div className="form-group">
                <div className="row">
                  
                  <div className="form-group col-md-12 "><br/>
                    <h5 className="text-center"> Towar #1</h5>
                  </div>
                  <div className="col-md-12 towar1">
                    <div className="form-row">
                      <div className="form-group col-md-10">
                        <Hover tekst="Numer Materiału" hint="6 do 9 znaków"></Hover>
                        <input type="text" pattern=".{6,9}" title="musi zawierać 6-9 znaków" className="form-control" id="inputtowar" required placeholder="Od 6 do 9 znaków" />
                      </div>
                      <div className="form-group col-md-2">
                        <label htmlFor="inputPassword4">Ilość</label>
                        <input type="number" className="form-control" id="inputilosc" required placeholder="ilość" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <label htmlFor="exampleFormControlTextarea1">Przyczyna reklamacji</label>
                        <textarea className="form-control" id="inputprzyczyna" required rows="3"></textarea>
                      </div>
                    </div>

                    
                  


              <div className="form-row">
                  <div className="form-group col-md-12">
                    <div className="dynamic-stuff">
                    </div>
                  </div>
                  </div></div><div className="col-md-12">
                    <p className=" add-one " onClick={this.DodajTowar}><s className='przycisk'>Dodaj towar do reklamacji</s></p>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-2">
                    </div>
                  </div>
              </div>
                  <div className="form-row">
              <div className="form-group col-md-12">
                  <FileUpload/> 
              </div>
            
          </div>

              <div className="form-group col-md-12 notka">
                        <p><s className="red">*</s> - pole wymagane</p>
                        <p><Hover tekst="Przykład" hint="przykładowy tekst"></Hover> - po najechaniu myszą wyświetlają się dodatkowe informacje</p>
              </div><br/><br/>
              <div className="form-group col-md-12 centruj2">
                     <input id="wyslij" type="submit" value="Prześlij formularz" className="fileupdate "  />
              </div>
         

                
              </div>


            </div></div></form></div>)
  }
}
//
class Popup2 extends React.Component{

  constructor(props){
    super(props);
    this.state={
      id:this.props.text,
      dane:[]
    }
  }

  KonkretnePliki(e){
    let pliki=[];
    e.forEach(element =>{
      let temp={
        
        'nazwa':element[0],
        'typ':element[1].slice(-4,element[1].length+3).replace('/',''),
        'sciezka':element[2],
        
      };
      pliki.push(temp);
    }
    );
    //console.log(reklamacje[1].datanabycia);
    //console.log("---");
    
    this.setState({dane:pliki})
    
  }

  componentDidMount =() =>{
    
    fetch("http://localhost/system_reklamacji/php/pobierz_pliki.php",{
      method:'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'klucz_nr': this.state.id,
        
      })
    }).then(res=>res.json())
    .then(json =>this.KonkretnePliki(json))

}

  render()
  {
    return(
      <div className='popup'><h1 className='centruj'>{this.state.id}<button className="zamknij" onClick={this.props.closePopup}>X</button></h1>
        <div className='popup_inner'>
        <div className="tg-wrap">
 
{this.state.dane.map((zmapowane)=>{
  
  return  <table key={Math.random()+zmapowane.nazwa}  className="tg table table2 table-sm ">
    <tbody>
 <tr>
    <td className="tg-0lax" colSpan="4">
      {zmapowane.typ==='pdf'?<div className = "App">
        <a href = {"http://localhost/system_reklamacji/"+zmapowane.nazwa} className="link" target = "_blank" rel="noopener noreferrer">{zmapowane.nazwa}</a>
      </div>:<ModalImage
  smallSrcSet="hihi"
  large={"http://localhost/system_reklamacji/"+zmapowane.nazwa}
  alt={zmapowane.nazwa}
/>}
    
      
</td>
  </tr></tbody>
</table>
  }

  
  )}
 
 </div>
          
          
        </div>
      </div>
    );
  }
}
//
class PopupNotatki extends React.Component{

  constructor(props){
    super(props);
    this.state={
      id:this.props.text,
      dane:[],
      TAvalue:'',
      refresher:false,
    }
    this.handleSendNote=this.handleSendNote.bind(this);
    
  }
TAhandleChange= (e) =>{
  this.setState({TAvalue:e.target.value});
}
  KonkretneNotatki(e){
    let pliki=[];
    e.forEach(element =>{
      let temp={
        'user':element[0],
        'notatka':element[1],
        'data':element[2],
        'akcja':element[3]
        
        
      };
      pliki.push(temp);
    }
    );
    //console.log(reklamacje[1].datanabycia);
    //console.log("---");
    
    this.setState({dane:pliki})
    
  }
 async handleSendNote(){
    console.log("oczekiwanie1");
   await setTimeout(() =>  this.setState({refresher:true}), 1000);
    
    
    fetch("http://localhost/system_reklamacji/php/dodaj_uwage.php",{
      method:'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'klucz_nr': this.state.id,
        'klucz_notatka':this.state.TAvalue,
        
      })
    }).then(res=>res.json()).catch(error=>console.log(error)).then(setTimeout(() =>  this.setState({refresher:!this.state.refresher}), 1030))
    .then(this.setState({TAvalue:""}));
    
    
    

  }
  componentDidMount =() =>{
    
    fetch("http://localhost/system_reklamacji/php/pobierz_notatki.php",{
      method:'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'klucz_nr': this.state.id,
        
      })
    }).then(res=>res.json())
    .then(json =>this.KonkretneNotatki(json))

}
componentDidUpdate=()=>{
if(this.state.refresher){
  console.log('aa');

  fetch("http://localhost/system_reklamacji/php/pobierz_notatki.php",{
    method:'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'klucz_nr': this.state.id,
      
    })
  }).then(res=>res.json())
  .then(json =>this.KonkretneNotatki(json))
}
}

  render()
  {
    return(
      <div className='popup'><h1 className='centruj'>{this.state.id}<button className="zamknij" onClick={this.props.closePopup}>X</button></h1>
        <div className='popup_inner'>
        <div className="tg-wrap">
 
{this.state.dane.map((zmapowane)=>{
  
  return  <table  className="tg table  table-sm "><tbody><tr>
  <td className="notki" ><label htmlFor='nazwa'>
  <Hover tekst="Użytkownik odpowiedzialny:" hint="w danym momencie"></Hover>
  </label><br/>{zmapowane.user==='wybierz osobę'?<null/>: zmapowane.user}</td>
     <td className="notki"><label htmlFor='ile'>Akcja:</label><br/>{zmapowane.akcja}</td>
     <td className="notki"><label htmlFor='ile'>Notatka:</label><br/>{zmapowane.notatka}</td>
     
     <td className="notki"><label htmlFor='dataw'>Data:</label><br/>{zmapowane.data}</td>
   </tr>
  </tbody>
 </table>
 
  }

  
  )}
 <table  className="tg table  table-sm "><tbody><tr>
  
     
     
     <td className="notki"><label htmlFor='dataw'>Wstaw Notatke:</label><br/><textarea value={this.state.TAvalue} onChange={this.TAhandleChange} style={{width:"100%"}}/><button onClick={this.handleSendNote} type='button'>Wyślij notatkę</button></td>
   </tr>
  </tbody>
 </table>
 </div>
          
          
        </div>
      </div>
    );
  }
}
//




//
var s;
class Testuje extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: [],
      pracownicy: [],
      kryteria:[],
      puste: false,
      showPopup: false,
      showPliki: false,
      showUwagi: false,
      showNotatki: false,
      current: '',
      strona: "",
      reqKey: '',
      Cookies:'',
      pracownik:'',
    }
    this.handleChangeChk = this.handleChangeChk.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.togglePliki = this.togglePliki.bind(this);
    this.toggleUwagi = this.toggleUwagi.bind(this);
    this.toggleNotatki= this.toggleNotatki.bind(this);
    
  }
  

  async componentDidUpdate(prevProps) {
    if (prevProps.what !== this.props.what) {
      if(this.props.moje)
      {
        
      }
      
      await this.setState({ strona: this.props.what })
      if(Cookies.get("log_auth"))
      {
       await fetch("http://localhost/system_reklamacji/php/pobierz_kryteria.php").then(res => res.json())
        .then(json => this.PrzypiszKryteria(json));
      
      await fetch("http://localhost/system_reklamacji/php/pobierz_pracownikow.php").then(res => res.json())
        .then(json => this.PrzypiszPracownikow(json))
        
        
        
        .then(fetch(this.props.what,{
          method:'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'klucz_cookie': Cookies.get("log_auth"),
            
          })
        })
          .then(res => res.json())
          .then(json => this.setState({ status: PokazAll(json) })
          ))}
    }
  }
  togglePopup(e) {
    e.preventDefault();
    this.setState({ showPopup: !this.state.showPopup, current: e.target.id });
    
  }
  togglePliki(e) {
    
    e.preventDefault();
    
    this.setState({ showPliki: !this.state.showPliki, current: e.target.id });
    
  }

  toggleUwagi(e) {
    
    e.preventDefault();
    
    this.setState({ showUwagi: !this.state.showUwagi, current: e.target.id });
    
  }
  
  toggleNotatki(e) {
    
    e.preventDefault();
    
    this.setState({ showNotatki: !this.state.showNotatki, current: e.target.id });
    
  }
  
  componentDidMount = async () => {

    if(Cookies.get("log_auth"))
      {
        await fetch("http://localhost/system_reklamacji/php/pobierz_kryteria.php").then(res => res.json())
        .then(json => this.PrzypiszKryteria(json));

    await fetch("http://localhost/system_reklamacji/php/pobierz_pracownikow.php").then(res => res.json())
      .then(json => this.PrzypiszPracownikow(json)).then(fetch(this.props.what,{
        method:'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'klucz_cookie': Cookies.get('log_auth'),
          
        })
      })
        .then(res => res.json())
        .then(json => this.setState({ status: PokazAll(json) })
        ))
    }
  }
  handleChangeChk(e) {
    let klucz = e.target.attributes.nrrekla.value;
    let answer;
        if(answer=prompt('Chcesz dodać komentarz?',''))
        {}
        else{answer="Zamknięto zgłoszenie";}
    fetch("http://localhost/system_reklamacji/php/zamknij_zgloszenie.php", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'klucz_nr': klucz,
        'klucz_notatka':answer
      })
    }).then(res => res.json())
      .then(this.forceUpdate()).then(window.location.reload());
  }
  
  details(info) {
    let buttonval = info.target.attributes.getNamedItem('aria-expanded').value;
    if (buttonval === 'false') {
      let nr_reklamacji = info.target.attributes.id.value;
      //console.log(nr_reklamacji);
      buttonval = 'true';
      // console.log(buttonval);
      ReklamacjaIndy(nr_reklamacji);
    }
    else {
      buttonval = 'false';
      
    }
    info.target.attributes.getNamedItem('aria-expanded').value = buttonval;
  }
 
  PrzypiszPracownikow(e) {
    let wszyscypracownicy = [];
    e.forEach(element => {
      let temp = {
        'id': element[0],
        'dane': element[1]
      };
      wszyscypracownicy.push(temp);
    }
    );
   // console.log(wszyscypracownicy);
    this.setState({ pracownicy: wszyscypracownicy })
  }

  PrzypiszKryteria(e) {
    let wszystkiekryteria = [];
    e.forEach(element => {
      let temp = {
        'id': element[0],
        'nazwa': element[1]
      };
      wszystkiekryteria.push(temp);
    }
    );
   // console.log(wszyscypracownicy);
    this.setState({ kryteria: wszystkiekryteria });
    
  }


jakdlugo(poczatek,koniec){

  const oneDay=24*60*60*1000;
  let start=new Date(poczatek);
  let stop = new Date(koniec);
  let ilosc = Math.ceil(Math.abs(start - stop)/oneDay);
return ilosc;
}


  render() {
    return (<div>
      {this.state.showPopup ?
        <Popup
          text={this.state.current}
          closePopup={this.togglePopup.bind(this)}
        />
        : null
      }
      {this.state.showPliki ?
        <Popup2
          text={this.state.current}
          closePopup={this.togglePliki.bind(this)}
        />
        : null
      }
     
      {this.state.showNotatki ?
        <PopupNotatki
          text={this.state.current}
          closePopup={this.toggleNotatki.bind(this)}
          kto={this.state.pracownik}
        />
        : null
      }
      <div className='wraper'>
      <table className='table table-sm table-hover  mojetable' cellSpacing="0" width="auto">
        <thead><tr>
          <th>NR reklamacji</th>
          <th>lość reklamacji</th>
          <th>Klient</th>
          {this.props.what!=="http://localhost/system_reklamacji/php/pobierz_nieprzypisane.php"?<th>Kryterium</th>:(null)}
          <th>Osoba zajmująca się</th>
          <th>Dokument</th>
          <th>Nazwa firmy</th>
          <th>Data Wystąpienia wady</th>
          <th>Data</th>
          <th>Pliki</th>
          {this.props.what==="http://localhost/system_reklamacji/php/pobierz_zakonczone.php"?<th>Czas realizacji</th>:(null)}
          
          
          {this.props.what !== "http://localhost/system_reklamacji/php/pobierz_moje.php"?
             (null) : (<th key={this.state.reqKey}>Zakończ</th>)}
            {this.props.what==="http://localhost/system_reklamacji/php/pobierz_zakonczone.php" ||
          this.props.what==="http://localhost/system_reklamacji/php/pobierz_moje.php"
          |
          this.props.what==="http://localhost/system_reklamacji/php/pobierz.php"?<th>Uwagi</th>:(null)}
        </tr></thead>
        <tbody>
          {this.state.status.map((dane) =>
            <tr className={dane.numer} key={dane.numer}><td style={{fontWeight: "bold"}}>{dane.numer}</td>
            
              <td className="accordion-toggle"><button className='przycisk' onClick={this.togglePopup} type='button' data-toggle='collapse' data-target={'#collapse' + dane.numer} aria-expanded='false' id={dane.numer} aria-controls={'#collapse' + dane.numer}>{dane.ile}</button></td>
              <td>{dane.klient}</td>
          {this.props.what!=="http://localhost/system_reklamacji/php/pobierz_nieprzypisane.php"?(this.props.what!=="http://localhost/system_reklamacji/php/pobierz_moje.php"?<td>{dane.kryterium==="wybierz kryterium"?null:dane.kryterium}</td>:
                (<td className='selectpicker'>
                    <select id={dane.numer} onChange={getkryterium.bind(this.value)} className='browser-default customer-select selectpicker'>
                                {this.state.kryteria.map((dane3) => {
                                  
                                      if(dane.kryterium===dane3.nazwa){
                                        return <option selected key={dane3.id} id={dane.numer + " " + dane3.dane} value={dane3.id}>{dane3.nazwa}</option>
                                      }
                                        return <option  key={dane3.id} id={dane.numer + " " + dane3.dane} value={dane3.id}>{dane3.nazwa}</option>}
                                 
                                
                                )}

                    </select>
                </td>)
              
              ):(null)}

        {this.props.what==="http://localhost/system_reklamacji/php/pobierz_zakonczone.php"?<td>{dane.lista_prac}</td>:
              (<td className='selectpicker'>
                   <select id={dane.numer} onChange={getval.bind(this.value)} className='browser-default customer-select selectpicker'>
                        {this.state.pracownicy.map((dane2) => {
                          if (dane.lista_prac === dane2.dane){
                                 return <option selected key={dane2.id} id={dane.numer + " " + dane2.dane} value={dane2.id}>{dane2.dane}</option>}
                          return <option key={dane2.id} id={dane.numer + " " + dane2.dane} value={dane2.id}>{dane2.dane}</option>
                  }
                  )}
                  </select> 
              </td>)}


              
              <td>{dane.fv}</td>
              <td>{dane.firma}</td>
              <td>{dane.data}</td>
              <td><p className="daty">Złożenia:<br/><b >{dane.datazlozenia}</b></p>{this.props.what==="http://localhost/system_reklamacji/php/pobierz_zakonczone.php"?<p className="daty" >Zakończenia:<br/><b style={{color:"red"}}>{dane.datazakonczenia}</b></p>:(null)}</td>
              <td>{dane.pliki===0?null:<button className='przycisk' onClick={this.togglePliki} type='button' data-toggle='collapse2' data-target={'#collapse2' +dane.numer} aria-expanded='false' id={dane.numer} style={{fontWeight: "bold"}}  aria-controls={'#collapse2' + dane.numer}>Pliki ({dane.pliki})</button>}</td>
              {this.props.what==="http://localhost/system_reklamacji/php/pobierz_zakonczone.php"?<td className='centruj3'>Ilość dni:<br /><h1 style={{color:'green'}}>{this.jakdlugo(dane.datazlozenia,dane.datazakonczenia)}</h1></td>:(null)}
              {this.props.what !== "http://localhost/system_reklamacji/php/pobierz_moje.php"  ? (null) : (<td style={{height:"100%"}}><button  className='zakoncz' nrrekla={dane.numer} onClick={this.handleChangeChk} type="checkbox" >Zamknij zgłoszenie</button></td>)}
                {this.props.what==="http://localhost/system_reklamacji/php/pobierz_zakonczone.php" ||
          this.props.what==="http://localhost/system_reklamacji/php/pobierz_moje.php"
          |
          this.props.what==="http://localhost/system_reklamacji/php/pobierz.php"?<td><button className='przycisk' onClick={this.toggleNotatki} id={dane.numer} type='button'>Uwagi</button></td>:(null)}
            </tr>
          )}
        </tbody></table></div>
    </div>
    )
  }
}
//

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currenttab: sessionStorage.getItem('tab')?sessionStorage.getItem('tab') :"temp" ,
      logged:false
    }
  }
  handleParentData = async (e) => {
    await this.setState({ currenttab: e})
    sessionStorage.setItem('tab',e);
    //console.log(sessionStorage.getItem('tab'));
    
  }
  componentDidMount(){
    document.title = "System zarządzania reklamacjami"
    
    }
  
  render() {
    return (
      <div>
        <AppHeader  handleData={this.handleParentData} />
        {(() => {
          if(Cookies.get("log_auth") && (Cookies.get("zalogowany"))){
          switch (this.state.currenttab) {
            case "wszystkie":
              return <Testuje  what="http://localhost/system_reklamacji/php/pobierz.php" />
            case "formularz":
              return <Formularz />
            case "nieprzypisane":
              return <Testuje what="http://localhost/system_reklamacji/php/pobierz_nieprzypisane.php" />
            case "zakonczone":
              return <Testuje what="http://localhost/system_reklamacji/php/pobierz_zakonczone.php" />
            case"moje":
              return <Testuje moje="true" what="http://localhost/system_reklamacji/php/pobierz_moje.php"/>
            default:  
              return 
          }
        }})()}
        
        <main className="ui main text container">
          
        </main>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
