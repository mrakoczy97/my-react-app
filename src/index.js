import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Cookies from 'js-cookie';
import { getval, PokazAll, ReklamacjaIndy } from './pobierz_tabele.js';
import * as serviceWorker from './serviceWorker';
import $ from 'jquery';
import Popup from './functions.js';

//Cookies.remove("log_auth");
console.log(Cookies.get("log_auth"));

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
    sessionStorage.setItem('tab','formularz');
    this.props.handlelogged(false);
    window.location.reload();
  }
 
  render(){
    return(
      <input className='form-group col-md-1' type='button' onClick={this.wyloguj} value="wyloguj"></input>
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
      if (response.ok) {  
        this.props.handlelogged(true);
        window.location.reload();
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    }).then(json => json ?  this.ustawCiasteczka(json) : null ).catch((error) => {
     // alert(error);
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
    <form onSubmit={this.handleSubmitLog} >
          <div className='col-md-12'style={{marginLeft:'95%'}}><div className='form-row'  >
            <div className='form-group col-md-4'><label htmlFor="inputEmail4">Login</label>
              <input type="text" name='imie' value={this.state.imie} required onChange={e => this.handleChangeLog(e)} className="form-control" id="inputlogin" />
            </div><div className='form-group col-md-4'><label htmlFor="inputEmail4">Hasło</label>
              <input type="password" name='haslo' value={this.state.haslo} required onChange={e => this.handleChangeLog(e)} className="form-control" id="inputhaslo" />
            </div><div className='form-group col-md-1'><label>Zaloguj</label><input id="wyslij" type="submit" value="Logowanie" className="btn btn-primary" />
            </div>
            <label className='form-group col-md-1' ></label>
          </div></div> </form>
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
    }

  render() {
    return (
      <div className='row'> {(!Cookies.get("log_auth") && (this.state.zalogowany)!==null?<Logowanie   handlelogged={this.handleParentlogged}/>:<Wylogowanie handlelogged={this.handleParentlogged}/>)}
        
       {(!Cookies.get("log_auth") && (this.state.zalogowany)!==null?null:<h2 style={{marginLeft:'35%'}}>Witaj {Cookies.get("zalogowany")}</h2>)}
        {(!Cookies.get("log_auth") && (this.state.zalogowany)!==null?null:
        <div className='col-md-12'>
          {(Cookies.get("log_auth") === null)?null:<div className='form-row' >
          <div className='form-group col-md-3'><a className={"btn btn-"+(
            this.state.tab==='formularz' && this.state.tab!==''?"success":
            (this.state.tab==='' && sessionStorage.getItem("tab")==="formularz"?"success":"info"
            ))+" btn-block"} tab='formularz' onClick={this.handleClick} href={this.state.tab}>Formularz zgłoszeniowy</a></div>
          <div className='form-group col-md'><a className={"btn btn-"+(
            this.state.tab==='nieprzypisane' && this.state.tab!==''?"success":
            (this.state.tab==='' && sessionStorage.getItem("tab")==="nieprzypisane"?"success":"info"
            ))+" btn-block"} tab="nieprzypisane" onClick={this.handleClick} href={this.state.tab}>Reklamacje nieprzypisane</a></div>
          <div className='form-group col-md'><a className={"btn btn-"+(
            this.state.tab==='moje' && this.state.tab!==''?"success":
            (this.state.tab==='' && sessionStorage.getItem("tab")==="moje"?"success":"info"
            ))+" btn-block"} tab="moje" onClick={this.handleClick} href={this.state.tab}>Moje reklamacje</a></div>
          <div className='form-group col-md'><a className={"btn btn-"+(
            this.state.tab==='wszystkie' && this.state.tab!==''?"success":
            (this.state.tab==='' && sessionStorage.getItem("tab")==="wszystkie"?"success":"info"
            ))+" btn-block"} tab="wszystkie" onClick={this.handleClick} href={this.state.tab}>Wszystkie reklamacje</a></div>
          <div className='form-group col-md'><a className={"btn btn-"+(
            this.state.tab==='zakonczone' && this.state.tab!==''?"success":
            (this.state.tab==='' && sessionStorage.getItem("tab")==="zakonczone"?"success":"info"
            ))+" btn-block"} tab="zakonczone" onClick={this.handleClick} href={this.state.tab}>Zakończone</a></div>
        </div>}
        </div>)}</div>
    );
  }
}
//
//
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
      console.log("click");
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
              id_klienta = (id_r.slice(3, -3));
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
                  <Hover tekst="Numer Materiału" hint="6 do 8 znaków"></Hover>
              
              <input type="text" pattern=".{6,8}" title="musi zawierać 6-8 znaków" defaultValue="" className="form-control" id="inputtowar" required placeholder="Numer Materiału" />
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
                  <div className="col-md-12">
                    <p className=" add-one " onClick={this.DodajTowar}><s className='przycisk'>Dodaj towar do reklamacji</s></p>
                  </div>
                  <div className="form-group col-md-12 "><br/>
                    <h5 className="text-center"> Towar #1</h5>
                  </div>
                  <div className="col-md-12 towar1">
                    <div className="form-row">
                      <div className="form-group col-md-10">
                        <Hover tekst="Numer Materiału" hint="6 do 8 znaków"></Hover>
                        <input type="text" pattern=".{6,8}" title="musi zawierać 6-8 znaków" className="form-control" id="inputtowar" required placeholder="Numer materiału" />
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

                    
                  </div></div>


              <div className="form-row">
                  <div className="form-group col-md-12">
                    <div className="dynamic-stuff">
                    </div>
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
var s;
class Testuje extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: [],
      pracownicy: [],
      puste: false,
      showPopup: false,
      showPliki: false,
      current: '',
      strona: "",
      reqKey: '',
      Cookies:'',
    }
    this.handleChangeChk = this.handleChangeChk.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }
  

  async componentDidUpdate(prevProps) {
    if (prevProps.what !== this.props.what) {
      if(this.props.moje)
      {
        console.log("Cookie:"+Cookies.get("log_auth"));
      }
      
      await this.setState({ strona: this.props.what })

      await fetch("http://localhost/system_reklamacji/php/pobierz_pracownikow.php").then(res => res.json())
        .then(json => this.PrzypiszPracownikow(json)).then(fetch(this.props.what,{
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
          ))
    }
  }
  togglePopup(e) {
    e.preventDefault();
    this.setState({ showPopup: !this.state.showPopup, current: e.target.id });
  }
  
  componentDidMount = async () => {

    
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
  handleChangeChk(e) {
    let klucz = e.target.attributes.nrrekla.value;
    fetch("http://localhost/system_reklamacji/php/zamknij_zgloszenie.php", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'klucz_nr': klucz,
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
      console.log(buttonval);
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
        <Popup
          text={this.state.current}
          closePopup={this.togglePopup.bind(this)}
        />
        : null
      }
      <table className='table table-sm table-hover unresponsive'>
        <thead><tr>
          <th>NR reklamacji</th>
          <th>Ilość reklamacji</th>
          <th>Klient</th>
          <th>Osoba zajmująca się</th>
          <th>Dokument</th>
          <th>Nazwa firmy</th>
          <th>Data</th>
          <th>Pliki</th>
          
          {this.props.what === "http://localhost/system_reklamacji/php/pobierz_zakonczone.php"
            || this.props.what === "http://localhost/system_reklamacji/php/pobierz_nieprzypisane.php" ? (null) : (<th key={this.state.reqKey}>Zakończ</th>)}
        </tr></thead>
        <tbody>
          {this.state.status.map((dane) =>
            <tr className={dane.numer} key={dane.numer}><td>{dane.numer}</td>
              <td className="accordion-toggle"><button className='btn btn-info' onClick={this.togglePopup} type='button' data-toggle='collapse' data-target={'#collapse' + dane.numer} aria-expanded='false' id={dane.numer} aria-controls={'#collapse' + dane.numer}>{dane.ile}</button></td>
              <td>{dane.klient}</td>
              <td className='selectpicker'>
                <select id={dane.numer} onChange={getval.bind(this.value)} className='browser-default customer-select selectpicker'>
                  {this.state.pracownicy.map((dane2) => {
                    if (dane.lista_prac === dane2.dane)
                      return <option selected key={dane2.id} id={dane.numer + " " + dane2.dane} value={dane2.id}>{dane2.dane}</option>
                    return <option key={dane2.id} id={dane.numer + " " + dane2.dane} value={dane2.id}>{dane2.dane}</option>
                  }
                  )}
                </select>
              </td>
              <td>{dane.fv}</td>
              <td>{dane.firma}</td>
              <td>{dane.data}</td>
              <td></td>
              
              {this.props.what === "http://localhost/system_reklamacji/php/pobierz_zakonczone.php" ||
                this.props.what === "http://localhost/system_reklamacji/php/pobierz_nieprzypisane.php" ? (null) : (<td><button  nrrekla={dane.numer} onClick={this.handleChangeChk} type="checkbox" >Zakończ</button></td>)}
            </tr>
          )}
        </tbody></table>
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
    console.log(sessionStorage.getItem('tab'));
    
  }
  
  
  render() {
    return (
      <div>
        <AppHeader  handleData={this.handleParentData} />
        {(() => {
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
              return <Formularz />
          }
        })()}
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
