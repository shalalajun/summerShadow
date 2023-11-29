export default class DomHandler {

    constructor(){

        this.loading = {
            container: document.getElementById('loadingContainer'),
            label: document.getElementById('loadingText'),
        };

        this.network = {
            container: document.getElementById('networkContainer'),
            statusText: document.getElementById('statusText'),
            countText: document.getElementById('countText'),
            domainText: document.getElementById('domainText'),
        };

        this.popup = {
            container: document.getElementById('popupContainer'),
            label: document.getElementById('popupText'),
        }

        this.setLoadingVisible(false);
        this.setNetworkBarVisible(false);
    }

    setLoadingVisible(state){
        if(state){
            this.loading.container.style.display = 'flex';
        }else{
            this.loading.container.style.display = 'none';
        }
    }

    setLoadingText(text){
        this.loading.label.textContent = text;
    }

    setNetworkBarVisible(state){
        if(state){
            this.network.container.style.display = 'flex';
        }else{
            this.network.container.style.display = 'none';
        }
    }

    setNetworkStatusText(text){
        this.network.statusText.textContent = text;
    }

    setPlayerCountText(text){
        this.network.countText.textContent = text;
    }

    setNetworkDomainText(text){
        this.network.domainText.textContent = text;
    }


    showPopup(msg){
        this.popup.label.textContent = msg;
        this.popup.container.style.display = 'flex';
    }
}