$(document).ready(function () {
    let selected;
    $("select.filtertype").change(function(){
        $('.type_input').val('')
        $('.api-details').hide()
        selected = $(this).children("option:selected").val()
        console.log(selected)
        if(selected !== 'select an option') $('.filter_content').show()
        switch (selected) {
            case 'objectid':
                $('.type_label').text('objectid(s)')
                $('.example').text('eg: 915,920')
                break;
            case 'externalId':
                $('.type_label').text('externalId(s)')
                $('.example').text('eg: ec537d92-06be-4a0f-bd69-b99347277f6c-0000c24e,7df7740a-9736-4a3e-81ec-45e05b0d2ad2-0000c28d')
                break;
            case 'prefix':
                $('.type_label').text('name')
                $('.example').text('eg: Basic Wall [49742]')
                break;
            case 'eq':
                $('.type_label').text('equals to')
                $('.example').text('eg: properties.Construction.Maximum Ridge Height,39.000 ft')
                break;
            case 'between':
                $('.type_label').text('')
                $('.example').text('eg: ')
                break;
            case 'le':
                $('.type_label').text('')
                $('.example').text('eg: ')
                break;
            case 'ge':
                $('.type_label').text('')
                $('.example').text('eg: ')
                break;
            case 'contains':
                $('.type_label').text('property name and value')
                $('.example').text('eg: properties.Constraints.Base Level,Top of Roof')
                break;
        
            default:
                break;
        }
    })

    $('.fetch').click(function(){
        console.log('fetch')
        let data = $('.type_input').val()
        fetchproperties(data)
    })

  async function fetchproperties(data) {
    $('.loader').show()
    let urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZXh0ZW5zaW9ubWFuYWdlcnNhbXBsZS9PZmZpY2UucnZ0'
    let guid = 'f6934ce8-fd90-c5ac-2bae-b56f725adc8c'
    let body = {
        "query": {
        },
        "fields": [
            "objectid",
            "name",
            "externalId",
            "properties.Cons*"
        ],
        "pagination": {
            "offset": 0,
            "limit": 20
        },
        "payload": "text"
    }
    switch (selected) {
        case 'objectid':
            let sr = data.split(',').map(Number)
            body.query = {"$in": ["objectid", ...sr]}
            break;
        case 'externalId':
            let er = data.split(',')
            body.query = {"$in": ["externalId", ...er]}
            break;
        case 'prefix':
            body.query = {"$eq": ["name",data]}
            break;
        case 'eq':
            
            break;
        case 'between':
            
            break;
        case 'le':
            
            break;
        case 'ge':
            
            break;
        case 'contains':
            let cr = data.split(',')
            body.query = {"$contains": cr}
            break;
    
        default:
            break;
    }
    let request = { data: body,url: `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${guid}/properties:query`}
    let res
    let response = await fetch(
        '/api/forge/modelderivative/specificproperties',
        {
            method: 'POST',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        }
    );
    res = await response.json();
    writeLog(res)
    $('.loader').hide()
    $('#request').jsonViewer(request)    
    console.log(res)
  }
    function writeLog(text) {
        $('.api-details').show()
        let elem = $('#response')
        elem.empty()
        $('#response').jsonViewer(text)
        elem.scrollTop = elem.scrollHeight;
    }
    $(".showrequest").click(function(){
        $('#request').toggle()
        $(this).text(function(i, text){
            return text === "Show Request" ? "Hide Request" : "Show Request";
        })
    });
})