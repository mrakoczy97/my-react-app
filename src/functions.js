import React from 'react';

class Popup extends React.Component{

  constructor(props){
    super(props);
    this.state={
      id:this.props.text,
      dane:[]
    }
  }

  KonkretneReklamacje(e){
    let reklamacje=[];
    e.forEach(element =>{
      let temp={
        'datanabycia':element[0],
        'nazwa':element[1],
        'ilosc':element[2],
        'przyczyna':element[3],
        'datawady':element[4]
      };
      reklamacje.push(temp);
    }
    );
    //console.log(reklamacje[1].datanabycia);
    //console.log("---");
    
    this.setState({dane:reklamacje})
    
  }

  componentDidMount =() =>{
    fetch("http://localhost/system_reklamacji/php/pobierz_konkretny.php",{
      method:'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'klucz_nr': this.state.id,
        
      })
    }).then(res=>res.json())
    .then(json =>this.KonkretneReklamacje(json))


  
  
  
  
}

  render()
  {
    return(
      <div className='popup'><h1 className='centruj'>{this.state.id}<button className="zamknij" onClick={this.props.closePopup}>X</button></h1>
        <div className='popup_inner'>
        <div className="tg-wrap">
 
{this.state.dane.map((zmapowane)=>{
  
  return  <table  className="tg table table2 table-sm "><tbody><tr>
 <td className="tg-0pky" ><label htmlFor='nazwa'>Nazwa:</label><br/>{zmapowane.nazwa}</td>
    <td className="tg-0lax"><label htmlFor='ile'>Ilość:</label><br/>{zmapowane.ilosc}</td>
    <td className="tg-0lax"><label htmlFor='datan'>Data nabycia:</label><br/>{zmapowane.datanabycia}</td>
    <td className="tg-0lax"><label htmlFor='dataw'>Data wystąpienia wady:</label><br/>{zmapowane.datawady}</td>
  </tr>
 <tr>
    <td className="tg-0lax" colSpan="4">{zmapowane.przyczyna}</td>
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
export default Popup;