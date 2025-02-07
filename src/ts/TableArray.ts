import { ipcRenderer } from "electron"

const submit = document.getElementById('submit') as HTMLInputElement
const rows = document.getElementById('rows') as HTMLInputElement
const columns = document.getElementById('columns') as HTMLInputElement
const gapX = document.getElementById('gapX') as HTMLInputElement
const gapY = document.getElementById('gapY') as HTMLInputElement

rows.value = '3'
columns.value = '2'
gapX.value = '0.05'
gapY.value = '0.05'

submit.onclick = () => {try{
    //conditions plz
    if(+rows.value <= 0 || +columns.value <= 0 || +gapX.value <= 0 || +gapY.value <= 0) {

        if(+rows.value <= 0) {rows.value = ""}
        if(+columns.value <= 0) {columns.value = ''}
        if(+gapX.value <= 0) {gapX.value = ''}
        if(+gapY.value <= 0) {gapY.value = ''}
        return;
    }

    ipcRenderer.send('TableArraySubmit', [rows.valueAsNumber, columns.valueAsNumber, gapX.valueAsNumber, gapY.valueAsNumber])
    window.close()
}catch(e){alert(e)}}