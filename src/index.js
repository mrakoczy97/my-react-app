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


class Wylogowanie extends React.Component{
  constructor(props){
    super(props);
    this.state={

    }
    this.wyloguj=this.wyloguj.bind(this);
  }
  wyloguj() {
    
    Cookies.remove('log_auth');
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
    }).then(json => json ?  Cookies.set("log_auth", json[0][0]) : null).catch((error) => {
      alert(error);
    });
     
    // .then(json =>this.zaloguj(json))
  }



  handleChangeLog = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

render(){
  return(
    <form onSubmit={this.handleSubmitLog} >
          <div className='col-md-12'><div className='form-row' >
            <div className='form-group col-md-3'><label htmlFor="inputEmail4">Login</label>
              <input type="text" name='imie' value={this.state.imie} required onChange={e => this.handleChangeLog(e)} className="form-control" id="inputlogin" />
            </div><div className='form-group col-md-3'><label htmlFor="inputEmail4">Hasło</label>
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
    e.preventDefault();
    if (Cookies.get("log_auth") == null) {
      
      ifexist = "x";
      await this.props.handleData("formularz");
      
      
    }
    else {
      
      ifexist = Cookies.get("log_auth");
      fetch("http://localhost/system_reklamacji/php/check_cookie.php", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'klucz_cookie': ifexist,
        })
      }).then(res => res.json()).then(json => (json[0][5] ? "YAY" : "NAY")).catch( (error) => {
        //alert("nie masz dostępu");
         this.props.handleData("formularz");
         Cookies.remove('log_auth');
      });
      await this.props.handleData(e.target.attributes.tab.value);
      
    }
    
    
    // console.log(ifexist);
    //  await this.setState({tab:e.target.attributes.tab.value});
    //console.log(this.state.tab);
  }

handleParentlogged = async (e) => {
      await this.setState({ islogged: e});
    }

  render() {
    return (
      <div className='row'>
        {(Cookies.get("log_auth"|| !this.state.zalogowany)==null?<Logowanie handlelogged={this.handleParentlogged}/>:<Wylogowanie handlelogged={this.handleParentlogged}/>)}
        
        <div className='col-md-12'>
          {(Cookies.get("log_auth") == null)?null:<div className='form-row' >
          <div className='form-group col-md-3'><a className="btn btn-info btn-block" tab='formularz' onClick={this.handleClick} href={this.state.tab}>Formularz zgłoszeniowy</a></div>
          <div className='form-group col-md'><a className="btn btn-danger btn-block" tab="nieprzypisane" onClick={this.handleClick} href={this.state.tab}>Reklamacje nieprzypisane</a></div>
          <div className='form-group col-md'><a className="btn btn-success btn-block" tab="" onClick={this.handleClick} href={this.state.tab}>Moje reklamacje</a></div>
          <div className='form-group col-md'><a className="btn btn-info btn-block" tab="wszystkie" onClick={this.handleClick} href={this.state.tab}>Wszystkie reklamacje</a></div>
          <div className='form-group col-md'><a className="btn  btn-warning btn-block" tab="zakonczone" onClick={this.handleClick} href={this.state.tab}>Zakończone</a></div>
        </div>}
           </div></div>
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
    await this.setState((prevState, props) => { return { tempi: prevState.tempi + 1 } });
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
    var kierowca = $('#inputkierowca').val();
    var id_r = "";
    var id_klienta;
    let tempi = this.state.tempi;
    // sprawdzenie czy wszystkie pola są wypełnione
    if (!imie || !nazwisko || !email || !telefon || !dokument || !firma || !datan || !dataw || !miejscowosc || !kierowca) {
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
          /*Zdefiniowanie tzw. alertu (prostej informacji) w sytacji sukcesu wysyłania. 
          Za pomocą alertów możemy diagnozować poprawne działania funkcji. 
          Jest to bardzo przydatne w sytacji problemów z dziłaniem programu.*/
          alert("Wysłano klienta do bazy danych");
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
              $.ajax({
                type: "POST",
                url: "http://localhost/system_reklamacji/php/wyslij_reklamacje_trans.php",
                dataType: 'html',
                data: {
                  klucz_imie: imie, klucz_nazwisko: nazwisko, klucz_dokument: dokument, klucz_datan: datan, klucz_dataw: dataw,
                  klucz_miejscowosc: miejscowosc, klucz_kierowca: kierowca, klucz_reklamacje: JSON.stringify(towary), klucz_id: id_klienta, klucz_ile: tempi
                },
                success: function () {
                  alert("Wysłano reklamacje do bazy danych");
                },
                error: function (blad) {
                  alert("Wystąpił błąd z wysłaniem reklamacji"); //wywala funkcje blad mimo tego ze dziala
                  console.log(blad);
                }
              });
            },
            //jeżeli nie uda się pobrać id klienta
            error: function (blad) {
              alert("Wystąpił błąd");
              console.log(blad);
            }
          });
          /*Dezaktywacja na określony czas przycisku wysyłającego - ten krok można pomninąć*/
          /*
                    $("#wyslij").attr("disabled", true);
                    setTimeout(function(){
                        $("#wyslij").attr("disabled", false); 
                    }, 10000);  
          */
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
      <div className="container">
        <div className="form-group dynamic-element" style={{ display: "none" }}>
          <hr className="col-md-12"></hr>
          <div className="row">
            <div className="form-group col-md-12 ">
              <h5 className="text-center"> Towar #</h5>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-9">
              <label htmlFor="inputdokument">Nazwa towaru</label>
              <input type="text" defaultValue="" className="form-control" id="inputtowar" placeholder="Nazwa towaru" />
            </div>
            <div className="group col-md-2">
              <label htmlFor="inputPassword4">Ilość</label>
              <input type="number" className="form-control" id="inputilosc" placeholder="ilość" />
            </div>
            <div className="col-md-1">
              <label htmlFor="inputPassword4"></label>
              <p className="form-control delete" onClick={this.attach_delete}>x</p>
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




        <form onSubmit={this.handleSubmit} >
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">Imie</label>
              <input type="text" name='imie' value={this.state.imie} required onChange={e => this.handleChange(e)} className="form-control" id="inputimie" placeholder="Imię" />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">Nazwisko</label>
              <input type="text" required name='nazwisko' value={this.state.nazwisko} onChange={e => this.handleChange(e)} className="form-control" id="inputnazwisko" placeholder="Nazwisko" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">Email</label>
              <input type="email" required name='email' value={this.state.email} onChange={e => this.handleChange(e)} className="form-control" id="inputemail" placeholder="Email" />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">Telefon Kontaktowy</label>
              <input type="tel" className="form-control" id="inputtelefon" onChange={e => this.handleChange(e)} name='telefon' value={this.state.telefon} required placeholder="nr telefonu" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputdokument">dokument</label>
              <input type="text" className="form-control" id="inputdokument" onChange={e => this.handleChange(e)} required name='dokument' value={this.state.dokument} placeholder="Dokument dostawy/FV" />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">Nazwa firmy</label>
              <input type="text" className="form-control" id="inputfirma" onChange={e => this.handleChange(e)} name='firma' value={this.state.firma} required placeholder="Nazwa firmy" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">Data nabycia towaru</label>
              <input type="date" className="form-control" id="inputgdate" onChange={e => this.handleChange(e)} name='datan' value={this.state.datan} required placeholder="DD-MM-RRRR" />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">Data stwierdzenia wady </label>
              <input type="date" className="form-control" id="inputbdate" onChange={e => this.handleChange(e)} name='dataw' value={this.state.dataw} required placeholder="DD-MM-RRRR" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputdokument">Miejscowość</label>
              <input type="text" className="form-control" id="inputmiejscowosc" onChange={e => this.handleChange(e)} required name='miejscowosc' value={this.state.miejscowosc} placeholder="Miejscowość" />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">Dane Kierowcy</label>
              <input type="text" className="form-control" id="inputkierowca" onChange={e => this.handleChange(e)} required name='kierowca' value={this.state.kierowca} placeholder="Imię i nazwisko Kierowcy" />
            </div>
            <hr className="col-xs-12"></hr>
          </div>
          <div className="form-row">
            <div className="form-group col-md-12">
              <div className="form-group">
                <div className="row">
                  <div className="col-md-12">
                    <p className="add-one" onClick={this.DodajTowar}>Dodaj towar do reklamacji</p>
                  </div>
                  <div className="form-group col-md-12 ">
                    <h5 className="text-center"> Towar #1</h5>
                  </div>
                  <div className="col-md-12 towar1">
                    <div className="form-row">
                      <div className="form-group col-md-10">
                        <label htmlFor="inputdokument">Nazwa towaru</label>
                        <input type="text" className="form-control" id="inputtowar" required placeholder="Nazwa towaru" />
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
                  </div></div>
              </div> <input id="wyslij" type="submit" value="Prześlij formularz" className="btn btn-primary" />


            </div></div></form></div>)
  }
}
//
class Testuje extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: [],
      pracownicy: [],
      puste: false,
      showPopup: false,
      current: '',
      strona: "",
      reqKey: ''
    }
    this.handleChangeChk = this.handleChangeChk.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.what !== this.props.what) {
      await this.setState({ strona: this.props.what })
      await fetch("http://localhost/system_reklamacji/php/pobierz_pracownikow.php").then(res => res.json())
        .then(json => this.PrzypiszPracownikow(json)).then(fetch(this.props.what)
          .then(res => res.json())
          .then(json => this.setState({ status: PokazAll(json) })
          ))
    }
  }
  togglePopup(e) {
    e.preventDefault();
    this.setState({ showPopup: !this.state.showPopup, current: e.target.id });
    //console.log(e.target.id);
    //tu działaj

  }
  componentDidMount = async () => {
    await fetch("http://localhost/system_reklamacji/php/pobierz_pracownikow.php").then(res => res.json())
      .then(json => this.PrzypiszPracownikow(json)).then(fetch(this.props.what)
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
      .then(this.ustawstate);
  }
  ustawstate = async () => {
    console.log(this.state.reqKey);
    await this.setState({ reqKey: Math.random() });
    console.log(this.state.reqKey);
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
    console.log(wszyscypracownicy);
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
      <table className='table table-sm table-hover unresponsive'>
        <thead><tr>
          <th>NR reklamacji</th>
          <th>Ilość reklamacji</th>
          <th>Klient</th>
          <th>Osoba zajmująca się</th>
          <th>Dokument</th>
          <th>Nazwa firmy</th>
          <th>Data</th>
          <th>Kierowca</th>
          {this.props.what === "http://localhost/system_reklamacji/php/pobierz_zakonczone.php"
            || this.props.what === "http://localhost/system_reklamacji/php/pobierz_nieprzypisane.php" ? (null) : (<th key={this.state.reqKey}>Zakończ</th>)}
        </tr></thead>
        <tbody>
          {this.state.status.map((dane) =>
            <tr key={dane.numer}><td>{dane.numer}</td>
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
              <td>{dane.kierowca}</td>
              {this.props.what === "http://localhost/system_reklamacji/php/pobierz_zakonczone.php" ||
                this.props.what === "http://localhost/system_reklamacji/php/pobierz_nieprzypisane.php" ? (null) : (<td><button type='checkbox' nrrekla={dane.numer} onClick={this.handleChangeChk} type="checkbox" >Zakończ</button></td>)}
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
      currenttab: "temp",
      logged:false
    }
  }
  handleParentData = async (e) => {
    await this.setState({ currenttab: e})
    
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
