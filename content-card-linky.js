const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

window.customCards = window.customCards || [];
window.customCards.push({
  type: "content-card-linky",
  name: "Carte Enedis par saniho",
  description: "Carte pour l'intégration myEnedis.",
  preview: true,
  documentationURL: "https://github.com/saniho/content-card-linky",
});
const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

function hasConfigOrEntityChanged(element, changedProps) {
  if (changedProps.has("config")) {
    return true;
  }

  const oldHass = changedProps.get("hass");
  if (oldHass) {
    return (
      oldHass.states[element.config.entity] !==
        element.hass.states[element.config.entity]
    );
  }

  return true;
}

class ContentCardLinky extends LitElement {
  static get properties() {
    return {
      config: {},
      hass: {}
    };
  }

  static async getConfigElement() {
    await import("./content-card-linky-editor.js");
    return document.createElement("content-card-linky-editor");
  }

  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this.config.entity];

    if (!stateObj) {
      return html`
        <ha-card>
          <div class="card">
            <div id="states">
              <div class="name">
                <ha-icon id="icon" icon="mdi:flash" data-state="unavailable" data-domain="connection" style="color: var(--state-icon-unavailable-color)"></ha-icon>
                <span style="margin-right:2em">Linky : donnees inaccessible pour ${this.config.entity}</span>
              </div>
            </div>
          </div>
        </ha-card> 
      `
    }

    const attributes = stateObj.attributes;
    const modeCompteur = attributes["typeCompteur"];
    
    if (stateObj) {
        if (( modeCompteur === "consommation" ) || ( !modeCompteur )){
          return html`
            <ha-card id="card">
              ${this.addEventListener('click', event => { this._showDetails(this.config.entity); })}
              ${this.renderTitle(this.config)}
              <div class="card">
                <div class="main-info">
                  ${this.config.showIcon
                    ? html`
                      <div class="icon-block">
                      <span class="linky-icon bigger" style="background: none, url(https://github.com/saniho/content-card-linky/blob/main/images/linky.jpg?raw=true) no-repeat; background-size: contain;"></span>
                      </div>`
                    : html `` 
                  }
                  ${this.config.showPeakOffPeak
                    ? html`
                      <div class="hp-hc-block">
                        <span class="conso-hc">${this.toFloat(attributes.yesterday_HC)}</span><span class="conso-unit-hc"> ${attributes.unit_of_measurement} <span class="more-unit">(en HC)</span></span><br />
                        <span class="conso-hp">${this.toFloat(attributes.yesterday_HP)}</span><span class="conso-unit-hp"> ${attributes.unit_of_measurement} <span class="more-unit">(en HP)</span></span>
                      </div>`
                    : html`
                      <div class="cout-block">
                        <span class="cout">${this.toFloat(stateObj.state)}</span>
                        <span class="cout-unit">${attributes.unit_of_measurement}</span>
                      </div>`
                  }
                  ${this.config.showPrice 
                    ? html `
                    <div class="cout-block">
                      <span class="cout" title="Coût journalier">${this.toFloat(attributes.daily_cost, 2)}</span><span class="cout-unit"> €</span>
                    </div>`
                    : html ``
                   }
                </div>
                <div class="variations">
                  ${this.config.showMonthRatio 
                    ? html `
                    <span class="variations-linky">
                      <span class="ha-icon">
                        <ha-icon icon="mdi:arrow-right" style="display: inline-block; transform: rotate(${(attributes.monthly_evolution < 0) ? '45' : ((attributes.monthly_evolution == 0) ? "0" : "-45")}deg)">
                       </ha-icon>
                      </span>
                      <div class="tooltip">
                      ${Math.round(attributes.monthly_evolution)}<span class="unit"> %</span><span class="previous-month">par rapport à ${this.previousMonth()}</span>
                          <span class="tooltiptext">Mois Precedent A-1 : ${attributes.last_month_last_year}<br>Mois Precedent : ${attributes.last_month}</span>
                      </div>
                    </span>`
                    : html ``
                   }
                  ${this.config.showCurrentMonthRatio 
                    ? html `
                    <span class="variations-linky">
                      <span class="ha-icon">
                        <ha-icon icon="mdi:arrow-right" style="display: inline-block; transform: rotate(${(attributes.current_month_evolution < 0) ? '45' : ((attributes.current_month_evolution == 0) ? "0" : "-45")}deg)">
                       </ha-icon>
                      </span>
                      <div class="tooltip">
                      ${Math.round(attributes.current_month_evolution)}<span class="unit"> %</span><span class="current-month">par rapport à ${this.currentMonth()}</span>
                          <span class="tooltiptext">Mois  A-1 : ${attributes.current_month_last_year}<br>Mois  : ${attributes.current_month}</span>
                      </div>
                    </span>`
                    : html ``
                   }
                  ${this.config.showWeekRatio 
                    ? html `
                    <span class="variations-linky">
                        <span class="ha-icon">
                          <ha-icon icon="mdi:arrow-right" style="display: inline-block; transform: rotate(${(attributes.current_week_evolution < 0) ? '45' : ((attributes.current_week_evolution == 0) ? "0" : "-45")}deg)">
                          </ha-icon>
                        </span>
                        <div class="tooltip">
                        ${Math.round(attributes.current_week_evolution)}<span class="unit"> %</span><span class="previous-month">par rapport à ${this.weekPreviousYear()}</span>
                        <span class="tooltiptext">Semaine A-1 : ${attributes.current_week_last_year}<br>Semaine courante : ${attributes.current_week}</span>
                    </div>
                      </span>`
                    : html ``
                   }
                  ${this.config.showYesterdayRatio
                    ? html `
                    <span class="variations-linky">
                        <span class="ha-icon">
                          <ha-icon icon="mdi:arrow-right" style="display: inline-block; transform: rotate(${(attributes.yesterday_evolution < 0) ? '45' : ((attributes.yesterday_evolution == 0) ? "0" : "-45")}deg)">
                         </ha-icon>
                        </span>
                        <div class="tooltip">
                        ${Math.round(attributes.yesterday_evolution)}<span class="unit"> %</span><span class="previous-month">par rapport à ${this.yesterdayPreviousYear()}</span>
                        <span class="tooltiptext">Hier A-1 : ${attributes.yesterdayLastYear}<br>Hier : ${attributes.yesterday}</span>
                    </div>
                      </span>`
                    : html ``
                   }
                  ${this.config.showPeakOffPeak 
                    ? html `
                      <span class="variations-linky">
                        <span class="ha-icon">
                          <ha-icon icon="mdi:flash"></ha-icon>
                        </span>
                        ${Math.round(attributes.peak_offpeak_percent)}<span class="unit"> % HP</span>
                      </span>`
                    : html ``
                   }
                  
                </div>
                ${this.renderHistory(attributes.daily, attributes.unit_of_measurement, attributes.dailyweek, attributes.dailyweek_cost, attributes.dailyweek_costHC, attributes.dailyweek_costHP, attributes.dailyweek_HC, attributes.dailyweek_HP, this.config)}
                ${this.renderError(attributes.errorLastCall, this.config)}
                ${this.renderVersion(attributes.versionUpdateAvailable, attributes.versionGit)}
              </div>
            </ha-card>`
        }
        if ( modeCompteur === "production" ){
          return html`
            <ha-card>
              <div class="card">
                <div class="main-info">
                  ${this.config.showIcon
                    ? html`
                      <div class="icon-block">
                      <span class="linky-icon bigger" style="background: none, url(https://github.com/saniho/content-card-linky/blob/main/images/linky.jpg?raw=true) no-repeat; background-size: contain;"></span>
                      </div>`
                    : html `` 
                  }
                  <div class="cout-block">
                     <span class="cout">${this.toFloat(stateObj.state)}</span>
                     <span class="cout-unit">${attributes.unit_of_measurement}</span>
                  </div>
                </div>
                ${this.renderError(attributes.errorLastCall, this.config)}
              </div>
            </ha-card>`
        }
    }
  }
  _showDetails(myEntity) {
    const event = new Event('hass-more-info', {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    event.detail = {
      entityId: myEntity
    };
    this.dispatchEvent(event);
    return event;
  }
  renderTitle(config) {
    if (this.config.showTitle === true) {
      return html
        `
          <div class="card">
          <div class="main-title">
          <span>${this.config.titleName}</span>
          </div>
          </div>` 
       }
  }
  renderError(errorMsg, config) {
    if (this.config.showError === true) {
       if ( errorMsg != "" ){
          return html
            `
              <div class="error-msg" style="color: red">
                <ha-icon id="icon" icon="mdi:alert-outline"></ha-icon>
                ${errorMsg}
              </div>
            `
       }
    }
  }
  renderVersion(versionUpdateAvailable, versionGit) {
    if ( versionUpdateAvailable === true ){
          return html
            `
              <div class="information-msg" style="color: red">
                <ha-icon id="icon" icon="mdi:alert-outline"></ha-icon>
                Nouvelle version disponible ${versionGit}
              </div>
            `
    }
    else{
       return html ``
    }
  }

  renderHistory(daily, unit_of_measurement, dailyweek, dailyweek_cost, dailyweek_costHC, dailyweek_costHP, dailyweek_HC, dailyweek_HP, config) {
    if (this.config.showHistory === true) {
      if ( dailyweek != undefined){
        var nbJours = dailyweek.toString().split(",").length ; 
        if ( config.nbJoursAffichage <= nbJours ) { nbJours = config.nbJoursAffichage }
        return html
          `
            <div class="week-history">
            ${this.renderTitreLigne(config)}
            ${daily.slice(0, nbJours).reverse().map((day, index) => this.renderDay(day, nbJours-index, unit_of_measurement, dailyweek, dailyweek_cost, dailyweek_costHC, dailyweek_costHP, 
               dailyweek_HC, dailyweek_HP, config))}
            </div>
          `
        }
    }
  }

  renderDay(day, dayNumber, unit_of_measurement, dailyweek, dailyweek_cost, dailyweek_costHC, dailyweek_costHP, dailyweek_HC, dailyweek_HP, config) {
    return html
      `
        <div class="day">
          ${this.renderDailyWeek(dailyweek, dayNumber, config)}
          ${this.renderDailyValue(day, dayNumber, unit_of_measurement, config)}
          ${this.renderDayPrice(dailyweek_cost, dayNumber, config)}
          ${this.renderDayPriceHCHP(dailyweek_costHC, dayNumber, config)}
          ${this.renderDayPriceHCHP(dailyweek_costHP, dayNumber, config)}
          ${this.renderDayHCHP(dailyweek_HC, dayNumber, unit_of_measurement, config)}
          ${this.renderDayHCHP(dailyweek_HP, dayNumber, unit_of_measurement, config)}
        </div>
      `
  }
  renderTitreLigne(config) {
    if (this.config.showTitreLigne === true) {
        return html
        `
            <div class="day">
        <br><span class="cons-val">Conso.</span>
        ${this.config.showDayPrice 
        ? html `
        <br><span class="cons-val">Prix</span>`
        : html ``
        }
        ${this.config.showDayPriceHCHP
        ? html `
        <br><span class="cons-val">Prix HP</span>`
        : html ``
        }
        ${this.config.showDayPriceHCHP 
        ? html `
        <br><span class="cons-val">Prix HC</span>`
        : html ``
        }
        ${this.config.showDayHCHP 
        ? html `
        <br><span class="cons-val">HP</span>`
        : html ``
        }
        ${this.config.showDayHCHP 
        ? html `
        <br><span class="cons-val">HC</span>`
        : html ``
        }
            </div>
        `;
      }
  }
  renderDailyWeek(value, dayNumber, config) {
    return html
    `
    <span class="dayname">${new Date(value.toString().split(",")[dayNumber-1]).toLocaleDateString('fr-FR', {weekday: config.showDayName})}</span>
    `;
  }
  renderNoData(){
     return html
          `
             <br><span class="cons-val" title="Donnée indisponible"><ha-icon id="icon" icon="mdi:alert-outline"></ha-icon></span>
           ` ;
  }
  renderDailyValue(day, dayNumber, unit_of_measurement, config) {
    if ( day === -1 ){
        return this.renderNoData();
    }
    else{
        return html
        `
        <br><span class="cons-val">${this.toFloat(day)} 
                  ${this.config.showInTableUnit 
                    ? html `
                      ${unit_of_measurement}`
                    : html ``
                   }</span>
       `;
    }
  }
  renderDayPrice(value, dayNumber, config) {
    if (config.kWhPrice) {
      return html
      `
        <br><span class="cons-val">${this.toFloat(value * config.kWhPrice, 2)} €</span>
      `;
    }
    if (config.showDayPrice) {
       const valeur = value.toString().split(",")[dayNumber-1] ;
       if ( valeur === "-1" ){
          return this.renderNoData();
       }
       else{
          return html
          `
             <br><span class="cons-val">${this.toFloat(valeur)} €</span>
           `;
       }
    }
  }
  renderDayPriceHCHP(value, dayNumber, config) {
    if (config.showDayPriceHCHP) {
       const valeur = value.toString().split(",")[dayNumber-1] ;
       if ( valeur === "-1" ){
          return this.renderNoData();
       }
       else{
          return html
          `
             <br><span class="cons-val">${this.toFloat(valeur, 2)} €</span>
          `;
       }
    }
  }
  renderDayHCHP(value, dayNumber, unit_of_measurement, config) {
    if (config.showDayHCHP) {
       const valeur = value.toString().split(",")[dayNumber-1] ;
       if ( valeur === "-1" ){
          return this.renderNoData();
       }
       else{
          return html
          `
             <br><span class="cons-val">${this.toFloat(valeur, 2)} 
           ${this.config.showInTableUnit 
                   ? html `
                     ${unit_of_measurement}`
                   : html ``
                  }</span>
          `;
        }
    }
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }

    if (config.kWhPrice && isNaN(config.kWhPrice)) {
      throw new Error('kWhPrice should be a number')
    }
    
    const defaultConfig = {
      showHistory: true,
      showPeakOffPeak: true,
      showIcon: false,
      showInTableUnit: false,
      showDayPrice: false,
      showDayPriceHCHP: false,
      showDayHCHP: false,
      showDayName: "long",
      showError: true,
      showPrice: true,
      showTitle: false,
      showCurrentMonthRatio: true,
      showMonthRatio: true,
      showWeekRatio: false,
      showYesterdayRatio: false,
      showTitreLigne: false,
      titleName: "",
      nbJoursAffichage: 7,
      kWhPrice: undefined,
    }

    this.config = {
      ...defaultConfig,
      ...config
    };
  }

  shouldUpdate(changedProps) {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  // @TODO: This requires more intelligent logic
  getCardSize() {
    return 3;
  }
 
  toFloat(value, decimals = 1) {
    return Number.parseFloat(value).toFixed(decimals);
  }
  
  previousMonth() {
    var d = new Date();
    d.setMonth(d.getMonth()-1) ;
    d.setFullYear(d.getFullYear()-1 );
    
    return d.toLocaleDateString('fr-FR', {month: "long", year: "numeric"});
  } 
  currentMonth() {
    var d = new Date();
    d.setFullYear(d.getFullYear()-1 );
    
    return d.toLocaleDateString('fr-FR', {month: "long", year: "numeric"});
  } 
  weekPreviousYear() {
    return "semaine";
  } 
  yesterdayPreviousYear() {
    return "hier";
  } 


  static get styles() {
    return css`
      .card {
        margin: auto;
        padding: 1.5em 1em 1em 1em;
        position: relative;
        cursor: pointer;
      }

      .main-title {
        margin: auto;
        text-align: center;
        font-weight: 200;
        font-size: 2em;
        justify-content: space-between;
      }
      .main-info {
        display: flex;
        justify-content: space-between;
      }
    
      .ha-icon {
        margin-right: 5px;
        color: var(--paper-item-icon-color);
      }
      
      .cout-block {
      }
  
      .cout {
        font-weight: 300;
        font-size: 4em;
      }
    
      .cout-unit {
        font-weight: 300;
        font-size: 1.5em;
        display: inline-block;
        vertical-align: 1.2em;
      }
    
      .conso-hp, .conso-hc {
        font-weight: 200;
        font-size: 2em;
      }
    
      .conso-unit-hc, .conso-unit-hp {
        font-weight: 100;
        font-size: 1em;
      }
      
      .more-unit {
        font-style: italic;
        font-size: 0.8em;
      }
    
      .variations {
        display: flex;
        justify-content: space-between;
      }

      .variations-linky {
        display: inline-block;
        font-weight: 300;
        margin: 1em;
      }
    
      .unit {
        font-size: .8em;
      }
    
      .week-history {
        display: flex;
      }
    
      .day {
        flex: auto;
        text-align: center;
        border-right: .1em solid var(--divider-color);
        line-height: 2;
        box-sizing: border-box;
      }
    
      .dayname {
        font-weight: bold;
        text-transform: capitalize;
      }
  
      .week-history .day:last-child {
        border-right: none;
      }
    
      .cons-val {
        //font-weight: bold;
      }
      
      .previous-month {
        font-size: 0.8em;
        font-style: italic;
        margin-left: 5px;
      }
      .current-month {
        font-size: 0.8em;
        font-style: italic;
        margin-left: 5px;
      }
      .icon-block {
      }
      .linky-icon.bigger {
        width: 6em;
        height: 5em;
        margin-top: -1em;
        margin-left: 1em;
        display: inline-block;
      }
      .error {
        font-size: 0.8em;
        font-style: bold;
        margin-left: 5px;
      }
      .tooltip {
        position: relative;
      }
      .tooltip .tooltiptext {
        visibility: hidden;
        background: var( --ha-card-background, var(--card-background-color, white) );
        box-shadow: 2px 2px 6px -4px #999;
        text-align: center;
        cursor: default;
        font-size: 14px;
        left: 62px;
        opacity: 1;
        pointer-events: none;
        position: absolute;
        top: 20px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        white-space: nowrap;
        z-index: 12;
        transition: 0.15s ease all;
        padding: 5px;
        border: 1px solid #cecece;
        border-radius: 3px;
      }
      .tooltip .tooltiptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
      }
      .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
      }
      `;
  }
}

customElements.define('content-card-linky', ContentCardLinky);
