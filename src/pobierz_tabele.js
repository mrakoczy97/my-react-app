



export function PokazAll(e){
    let tabela=[];
    e.forEach(element =>{
      let temp={
        'numer':element[0],
        'ile':element[1],
        'klient':element[2],
        'lista_prac':element[3],
        'fv':element[4],
        'firma':element[5],
        'data':element[6],
        'pliki':element[7],
        'datazlozenia':element[8],
        'datazakonczenia':element[9],
        'kryterium':element[10],
        
        
      };
      tabela.push(temp);
      
    });
    return (tabela);
    
   }
 function PokazReklamowanyTowar(e){
    let tabela=[];
    e.forEach(element =>{
        let temp={
        'nazwa':element[0],
        'ilosc':element[1],
        'data':element[2],
        'tekst':element[3]
    };
    tabela.push(temp);
    });
    return(tabela);
}

   export function getval(sel){
     let answer;
    if(answer=prompt('Chcesz dodać komentarz do zmiany?',''))
    {}
    else{answer="Przekazano zgłoszenie dalej";}
    return fetch('http://localhost/system_reklamacji/php/zmien.php',{
       method:'POST',
       headers:{
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         'klucz_nr': sel.target.id,
         'klucz_idprac': sel.target.value,
         'klucz_notatka':answer
       })
     }).then((response) => {
      if (response.ok) {  
        
        alert("Zmieniono osobę pomyślnie");
        
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    });
     
    
 }
 export function getkryterium(sel){
  let answer;
  if(answer=prompt('Chcesz dodać komentarz do zmiany?',''))
  {}
  else{answer="Przekazano zgłoszenie dalej";}
  return fetch('http://localhost/system_reklamacji/php/zmienkryterium.php',{
     method:'POST',
     headers:{
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       'klucz_nr': sel.target.id,
       'klucz_kryterium': sel.target.value,
       'klucz_notatka':answer
     })
   }).then((response) => {
    if (response.ok) {  
      
      alert("Zmieniono kryterium pomyślnie");
      
      return response.json();
    } else {
      throw new Error('Something went wrong');
    }
  });
 }

 export function ReklamacjaIndy(dane){
    return fetch('http://localhost/system_reklamacji/php/pobierz_konkretny.php',{
        method:'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'klucz_nr': dane,
          
        })
      }).then(msg=> msg.json()).then(res=>PokazReklamowanyTowar(res))
     
 }

 export function WprowadzReklamacje(dane){
  return fetch('http://localhost/system_reklamacji/php/wyslij_reklamacje_trans.php',{
    method:'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'klucz_dane': dane
      
    })
  }).then(msg=> msg.json()).then(res=>console.log(res))
 }

 