
fetch('https://cors-anywhere.herokuapp.com/https://covid19.who.int/WHO-COVID-19-global-data.csv',{
    "method" : "GET",
})
.then(response => response.text())
.then(data => {
    var op = (Papa.parse(data)).data;

    var d = new Date;    
    var month = (d.getMonth()<10)? `0${d.getMonth()}` : d.getMonth();
    var day = (d.getDate()<10)? `0${d.getDate()}` : d.getDate();

    var fulldate = `${d.getFullYear()}-${month}-${day}`;
    var todayList = [];
    var globalList = {
        1 : "Global Status",    //country_code
        2 : "Global Status",    //country
        4 : 0,  //new_cases
        5 : 0,  //total_cases
        6 : 0,  //new_deaths
        7 : 0   //total_deaths
    };

    op.forEach(element => {
        if( element[0] === fulldate ){
            todayList.push(element);
            globalList[4] += parseInt(element[4]);
            globalList[5] += parseInt(element[5]);
            globalList[6] += parseInt(element[6]);
            globalList[7] += parseInt(element[7]);
        }
    });
    console.log(todayList);

    
    class ui{
		static display(i){
			let id = document.getElementById('country');
			if( i !== -1){
                id.innerHTML = todayList[i][2];
                let totalCases = document.getElementById('totalCases');
                totalCases.innerHTML = todayList[i][1];
                let totalRecoveries = document.getElementById('totalRecoveries');
                totalRecoveries.innerHTML = todayList[i][4];
                let totalDeaths = document.getElementById('totalDeaths');
                totalDeaths.innerHTML = todayList[i][5];
                let casesToday = document.getElementById('casesToday');
                casesToday.innerHTML = todayList[i][6];
                let deathsToday = document.getElementById('deathsToday');
                deathsToday.innerHTML = todayList[i][7];
			}
			else{
                id.innerHTML = "Global Status";
                let totalCases = document.getElementById('totalCases');
                totalCases.innerHTML = globalList[1];
                let totalRecoveries = document.getElementById('totalRecoveries');
                totalRecoveries.innerHTML = globalList[4];
                let totalDeaths = document.getElementById('totalDeaths');
                totalDeaths.innerHTML = globalList[5];
                let casesToday = document.getElementById('casesToday');
                casesToday.innerHTML = globalList[6];
                let deathsToday = document.getElementById('deathsToday');
                deathsToday.innerHTML = globalList[7];
			}

			// let activeCases = document.getElementById('activeCases');
			// activeCases.innerHTML = data[i].active;
		}
		static search(searchItem){
			let matches = todayList.filter( data => {
				const regex = new RegExp(`${searchItem}`, 'gi');
				return data[2].match(regex);
			});
			if (searchItem.length === 0){
                matches = [];
            	ui.display(-1);
			}
		
			const html = matches.map(
				x => `<option value = "${x[2]}"> country Code : ${x[1]}</option>`
			).join('');
			return html;
		}
	}
	ui.display(-1);
	var form = document.getElementById('countrySearch');
	form.addEventListener('input', (e) => {
		e.preventDefault();
		let searchTxt = document.getElementById('searchTxt').value;
		let html = ui.search(searchTxt);
		var datalist = document.querySelector('#datalist');
    	datalist.innerHTML = html;
	});
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		let searchTxt = document.getElementById('searchTxt').value;
		let countryName = searchTxt;
		for( let j=0; j<todayList.length; j++){
			if ( todayList[j][2] === countryName ) {
				ui.display(j);			
			}
		}
		form.reset();
	})
})
.catch(err => {
    console.error(err);
	document.getElementById('main').style.display = 'none';
	document.getElementById('search').style.display = 'none';
	document.getElementById('error').style.display = 'block';
	document.getElementById('errorBody').innerHTML = err;
})
