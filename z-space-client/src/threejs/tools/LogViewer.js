import Project from "../Project";

/**
 * 모바일에서 로그 보기 어려워서 화면상에 표시하도록 만듬.
 * 사용법 : 
 *      어디에서든 상관없이 LogViewer 인스턴스를 생성 new LogViewer();
 *      생성하면 window.logger 변수에 할당됨
 *      window.logger.add(text); 함수로 호출하면 화면상에 표시됨
 */
export default class LogViewer {

    constructor(){

        this.dom = null;
        this.isFold = false;
        this._initDOM();
        this.maxLabelCount = 10;

        //
        // const folder = Project.getInst().debug.ui.addFolder('Log Viewer');
        // this.debugParams = {
        //     addRow: () => {this._testAddRandomRow()},
        // };

        // folder.add(this.debugParams, 'addRow');

        window.logger = this;
    }

    _initDOM(){

        //container
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.right = 0;
        container.style.bottom = 0;
        container.style.width = '50%';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'flex-end';
        document.body.appendChild(container);

        //button container
        const btnContainer = document.createElement('div');
        container.appendChild(btnContainer);

        //clear button
        const btnClear = document.createElement('button');
        btnClear.textContent = 'clear';
        btnClear.addEventListener('click', () => {
            this.dom.labels.forEach(i => i.remove());
            this.dom.labels = [];
        });
        btnContainer.appendChild(btnClear);

        //toggle button
        const btnToggle = document.createElement('button');
        btnToggle.textContent = 'button';
        btnToggle.addEventListener('click', () => {
            this.changeToggleState(!this.isFold)
        });
        btnContainer.appendChild(btnToggle);

        //list container
        const listContainer = document.createElement('div');
        listContainer.style.backgroundColor = '#00000088';
        listContainer.style.minHeight = 50 + 'px';
        listContainer.style.alignSelf = 'stretch';
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'column';
        container.appendChild(listContainer);

        this.dom = {
            container,
            btnToggle,
            listContainer,
            labels:[],
        }

        this.changeToggleState(this.isFold);
    }

    changeToggleState(state){

        this.isFold = state;

        if(state){
            this.dom.listContainer.style.display = 'none';
            this.dom.btnToggle.textContent = 'Log View';
        }else{
            this.dom.listContainer.style.display = 'block';
            this.dom.btnToggle.textContent = 'Log Hide';
        }
    }

    //레이아웃 동작 테스트용으로 랜덤한 문장을 출력
    _testAddRandomRow(){

        const sentences = [
            '안녕하세요! JavaScript를 만나뵙게 되어 반가워요.',
            '자바스크립트로 다양한 프로젝트를 만들어보세요.',
            '열심히 공부하면 더 멋진 코드를 작성할 수 있을 거에요.',
            '프로그래밍은 창의력을 펼치는 좋은 수단입니다.',
            '코드를 작성하며 문제를 해결하는 과정이 즐거워집니다.',
            '프로그래밍은 문제를 해결하는 놀라운 여행입니다. 어려움을 극복하면서 더 강해질 수 있어요.',
            '코딩은 마법과 같은 힘을 갖고 있습니다. 당신의 아이디어를 현실로 만들어봐요.',
            '지식을 나누는 것은 성장의 시작입니다. 함께 공유하며 더 나은 개발자가 되어봐요.',
            '자바스크립트는 다양한 플랫폼에서 동작하며, 웹 개발뿐만 아니라 다양한 분야에서 사용됩니다.',
            '코드는 예술입니다. 간결하고 읽기 쉬운 코드를 작성해봐요. 그것이 진정한 프로페셔널리즘입니다.'
        ];

        const idx = Math.floor(Math.random() * sentences.length);
        this.addRow(sentences[idx]);
    }

    add(text){

        if(this.dom.labels.length >= this.maxLabelCount) {

            //맨 처음 라벨을 맨 뒤로 보내고 글씨쓰기
            const label = this.dom.listContainer.firstElementChild;
            this.dom.listContainer.appendChild(label);
            label.textContent = text;

        }else{
            const label = this._createRow();
            label.textContent = text;
        }
    }

    _createRow(){

        const label = document.createElement('label');
        label.style.backgroundColor = '#00000066';
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        //label.style.maxHeight = '55px';
        label.style.maxHeight = '4.5vh';
        label.style.overflow = 'hidden';
        label.style.fontSize = '0.8em';
        
        this.dom.labels.push(label);        
        this.dom.listContainer.appendChild(label);
        return label;
    }
    
    dispose(){
        this.dom = null;
    }
}