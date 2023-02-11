export class DateDreamer extends HTMLElement {
    startDate: string | null;
    endDate: string | null;

    constructor() {
        super();

        this.startDate = this.getAttribute("start");
        this.endDate = this.getAttribute("end");
        this.attachShadow({ mode: "open" });
        
    }

    connectedCallback(): void {
        

        this.createTemplate();
    }

    createTemplate(): void {

        const template = document.createElement('div');
        template.innerHTML = `
            Test: ${this.startDate}
        `;

        this.shadowRoot?.appendChild(template);
    }
}

customElements.define("datedreamer-calendar", DateDreamer);