const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

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
                <span style="margin-right:2em">Linky : donnees inaccessible</span>
              </div>
            </div>
          </div>
        </ha-card> 
      `
    }

    const attributes = stateObj.attributes;

    if (stateObj) {
      return html`
        <ha-card>
          <div class="card">
            <div class="main-info">
              ${this.config.showIcon
                ? html`
                  <div class="icon-block">
                  <span class="linky-icon bigger" style="background: none, url(/hacsfiles/content-card-linky/linky.jpg) no-repeat; background-size: contain;"></span>
                  </div>`
                : html `` 
              }
              ${this.config.showPeakOffPeak
                ? html`
                  <div class="hp-hc-block">
                    <span class="conso-hc">${this.toFloat(attributes.offpeak_hours)}</span><span class="conso-unit-hc"> ${attributes.unit_of_measurement} <span class="more-unit">(en HC)</span></span><br />
                    <span class="conso-hp">${this.toFloat(attributes.peak_hours)}</span><span class="conso-unit-hp"> ${attributes.unit_of_measurement} <span class="more-unit">(en HP)</span></span>
                  </div>`
                : html`
                  <div class="cout-block">
                    <span class="cout">${this.toFloat(stateObj.state)}</span>
                    <span class="cout-unit">${attributes.unit_of_measurement}</span>
                  </div>`
              }
              <div class="cout-block">
                <span class="cout" title="Coût journalier">${this.toFloat(attributes.daily_cost, 2)}</span><span class="cout-unit"> €</span>
              </div>
            </div>
            <div class="variations">
              <span class="variations-linky">
                <span class="ha-icon">
                  <ha-icon icon="mdi:arrow-right" style="transform: rotate(${(attributes.monthly_evolution < 0) ? '45' : ((attributes.monthly_evolution == 0) ? "0" : "-45")}deg)">
                  </ha-icon>
                </span>
                ${Math.round(attributes.monthly_evolution)}<span class="unit"> %</span><span class="previous-month">par rapport à ${this.previousMonth()}</span>
              </span>
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
            ${this.renderHistory(attributes.daily, attributes.unit_of_measurement, this.config)}
          </div>
        <ha-card>`
    }
  }

  renderHistory(daily, unit_of_measurement, config) {
    if (this.config.showHistory === true) {
      return html
        `
          <div class="week-history">
            ${daily.slice(0, 7).reverse().map((day, index) => this.renderDay(day, 7-index, unit_of_measurement, config))}
          </div>
        `
    }
  }

  renderDay(day, dayNumber, unit_of_measurement, config) {
    return html
      `
        <div class="day">
          <span class="dayname">${new Date(new Date().setDate(new Date().getDate()-(Number.parseInt(dayNumber)))).toLocaleDateString('fr-FR', {weekday: "long"}).split(' ')[0]}</span>
          <br><span class="cons-val">${this.toFloat(day)} 
              ${this.config.showInTableUnit 
                ? html `
                  ${unit_of_measurement}`
                : html ``
               }</span>
          ${this.renderDayPrice(day, config)}
        </div>
      `
  }

  renderDayPrice(value, config) {
    if (config.showPeakOffPeak === false && config.kWhPrice) {
      return html
      `
        <br><span class="cons-val">${this.toFloat(value * config.kWhPrice, 2)} €</span>
      `;
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
      showHistory : true,
      showPeakOffPeak: true,
      showIcon: false,
      showInTableUnit : false,      
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
    //return new Date((new Date().getTime()) - 365*60*60*24*1000)
    var d = new Date();
    d.setMonth(d.getMonth()-1) ;
    d.setFullYear(d.getFullYear()-1 );
    
    return d.toLocaleDateString('fr-FR', {month: "long", year: "numeric"});
  } 


  static get styles() {
    return css`
      .card {
        margin: auto;
        padding: 1.5em 1em 1em 1em;
        position: relative;
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
        text-transform: uppercase;
      }
  
      .week-history .day:last-child {
        border-right: none;
      }
    
      .cons-val {
        font-weight: bold;
      }
      
      .previous-month {
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
      `;
  }
}

customElements.define('content-card-linky', ContentCardLinky);
