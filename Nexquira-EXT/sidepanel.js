document.addEventListener('DOMContentLoaded',()=>{
    chrome.storage.local.get(['ResearchInsights'], function(result){
        if(result.ResearchInsights){
            document.getElementById("notes").value = result.ResearchInsights;
        }

});
document.getElementById('summarizeBtn').addEventListener('click',Summarize)
document.getElementById('saveNotesBtn').addEventListener('click',SaveNotes)

});

async function Summarize() {
    try{
        const[tab] = await chrome.tabs.query({active:true, currentWindow:true})
        const[{result}] = await chrome.scripting.executeScript({
            target:{tabId : tab.id},
            function:()=> window.getSelection().toString()
        });

        if(!result){
            showResult('Please select some text first')
            return;

        }
        const response =  await fetch('http://localhost:8080/api/research/process',{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({content:result,operation: 'summarize'})
        });

        if(!response.ok){
            throw new Error(`API Error: ${response.status}`);
        }

        const text = await response.text();
        showResult(text.replace(/\n/g,'<br>'));

    }catch(error){
        showResult('Error: ' + error.message);
    }

    
}
async function SaveNotes() {
    const notes = document.getElementById('notes').value;
    chrome.storage.local.set({'ResearchInsights':notes}, function(){
        alert('Notes saved successfully');
});
    
}

function showResult(content){
    document.getElementById('results').innerHTML = 
    `
<div class="result-item">
    <div class="result-content">
        ${content}
    </div>
</div>
`;

}