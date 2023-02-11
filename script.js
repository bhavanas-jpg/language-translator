// select all required elements
const fromText = document.querySelector('.from-text'),
      toText   = document.querySelector('.to-text'),
      selectTag = document.querySelectorAll('select'),
      translateBtn = document.querySelector('button'),
      exchangeIcon = document.querySelector('.exchange'),
      icons = document.querySelectorAll('.row i');
      let errorMsg = document.querySelector('.error-message');

      fromText.addEventListener('input', (e)=>{
        errorMsg.style.display=  "none";
        if(e.target.value == ''){
            toText.value = '';
        }
      })
    
      selectTag.forEach((tag, id)=>{
        for(const country_code in countries){
            //selecting English by default as FROM language and Hindi as TO language
            let selected;
            if(id == 0 && country_code == 'en-GB'){
                selected = "selected";
            }else if(id == 1 && country_code == 'hi-IN'){
                selected = "selected"
            }
         // creating and adding option tags to select tag
            let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
            tag.insertAdjacentHTML("beforeend", option)
        }
      })

      exchangeIcon.addEventListener("click", ()=>{
        let tempText = fromText.value,
            tempLang = selectTag[0].value;
            fromText.value = toText.value;
            selectTag[0].value = selectTag[1].value;
            toText.value = tempText;
            selectTag[1].value = tempLang;
      })

     

      translateBtn.addEventListener("click", ()=>{
        let text, 
        translateFrom, 
        translateTo ,
        apiUrl;

        if(fromText.value == ''){
            errorMsg.style.display=  "block";
            errorMsg.innerText = "Please enter the text";
            
        }
        else{
            errorMsg.style.display=  "none";
            text = fromText.value;
            translateFrom = selectTag[0].value;
            translateTo = selectTag[1].value;
            apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
        }
         
       

        fetch(apiUrl)
        .then(res => res.json())
        .then(data =>{   
            toText.value = data.responseData.translatedText;
        })
      })

      icons.forEach(icon =>{
        icon.addEventListener("click", ({target})=>{
         if(target.classList.contains("fa-copy")){
            // if clicked icon has from id , copy the fromtextarea value else copy the toTextarea value
            if(target.id == "from"){
                navigator.clipboard.writeText(fromText.value);
            }else{
                navigator.clipboard.writeText(toText.value);
            }
         }else{
            let utterance;
            // if clicked icon has from id, speak the fromTextarea value else speak the toTextarea value
            if(target.id == "from"){
                utterance = new SpeechSynthesisUtterance(fromText.value);
                //setting utterance language to fromSelect tag value
                utterance.lang = selectTag[0].value;             
            }else{
             utterance = new SpeechSynthesisUtterance(toText.value);
             //setting utterance language to toSelect tag value
             utterance.lang = selectTag[1].value;
            }
            // speak the passed utterance
            speechSynthesis.speak(utterance);
         }
        })
      })