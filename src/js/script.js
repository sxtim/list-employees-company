BX24.install(function(){
    BX24.callMethod('user.current', {}, function(res){
        alert('Приложение установленно, ' + res.data().NAME + '!');
        BX24.installFinish();
    });
});

BX24.init(() => {
    BX24.callMethod('crm.deal.list', {
        select:["*"],
        filter: {
            ">ID": 0
        },
        order: {
            ID:"ASC"
        },
    }, (result) => {
        let crm = result.data()
        console.log(result);
        if (result.error()) {
            console.error(result.error());
        } else if (result.data()) {
            const user = result.data();
            if (user) {
                document.querySelector('.app').textContent = 'У вас ID:' + user.ID + ' зовут ' + user.NAME;
            }
        }
    });
});