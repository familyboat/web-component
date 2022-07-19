import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { clamp, defaultPalette, mapValueToPercent } from './util.js';

/**
 * wc-slider can have one or more tick, which represents data you want to display.
 * between tick, there is a subslider, which colors by default palette in turn.
 * when subslider`s lenght exceed default palette`s lenght, first color returns.
 *
 * (todo: how to use wc-slider)
 */
export class WcSlider extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
    }

    :host {
      box-sizing: border-box;
      display: block;

      padding-top: 8px;
      padding-bottom: 20px;

      touch-action: none;
    }

    .slider {
      display: flex;
      position: relative;

      border: 1px solid blue;
      border-radius: var(--slider-border-radius, 6px);
    }

    .subSlider {
      height: var(--slider-height, 10px);
    }

    .tick {
      position: absolute;

      width: var(--tick-size, 22px);
      height: var(--tick-size, 22px);
      top: calc(calc(var(--slider-height, 10px) - var(--tick-size, 22px)) / 2);

      cursor: pointer;
      z-index: 1;

      background-color: white;
      border: 1px solid red;
      border-radius: 50%;
    }

    .tick.active {
      outline: gold solid 3px;
    }

    .tick::after {
      content: attr(data-title);
      position: absolute;
      top: 100%;
      width: 100%;

      text-align: center;
    }

    .curtain {
      position: fixed;

      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      display: none;
    }

    .curtain.show {
      display: unset;
    }
  `;

  /**
   * {type}: array 刻度数组，数组元素代表一个刻度。数组元素可以是无序的，但是会按照顺序（数字大小）
   * 将其显示在滑块上。
   *
   * {default}: []
   */
  private _tickList: number[] = [];

  @property({ type: Array })
  set tickList(val: number[]) {
    const oldVal = this._tickList;
    this._tickList = val;
    this.requestUpdate('tickList', oldVal);
  }

  get tickList() {
    const val = this._tickList;
    const [low, high] = this.tickRange;
    return val.map(item => clamp(low, item, high));
  }

  /**
   * {type}: array 将tickList的值映射为相对range的百分占比。
   *
   * {default}: []
   *
   * {example}
   * const tickList = [12, 34];
   * const range = [0, 200];
   *
   * // 映射后的结果
   * const tickProportionList = [6, 17];
   */
  get tickProportionList() {
    const _tickList = this.tickList;
    return mapValueToPercent(_tickList, this.tickRange);
  }

  /**
   * {type}: array 刻度值所处的范围，超出范围的值取最接近的该范围的值。
   *
   * {default}: [0, 100]
   */
  @property({ type: Array }) tickRange: [number, number] = [0, 100];

  /**
   * {type}: number | null 当前处于活动状态的刻度索引
   */
  @state()
  private activeIndex: number | null = null;

  private palette = defaultPalette;

  connectedCallback() {
    super.connectedCallback();
  }

  activateTick(e: PointerEvent) {
    const { target } = e;
    if (!(target as HTMLElement).classList.contains('tick')) return;
    this.activeIndex = Number((target as HTMLElement).dataset.index);
  }

  deactivateTick() {
    this.activeIndex = null;
  }

  moveTick(e: PointerEvent) {
    if (this.activeIndex === null) return;
    const { currentTarget, clientX, buttons } = e;
    if (currentTarget === null || buttons === 0) {
      this.activeIndex = null;
      return;
    };
    const { offsetLeft, offsetWidth } = currentTarget as HTMLElement;
    const [low, high] = this.tickRange;
    const newValue =
      low + ((high - low) * (clientX - offsetLeft)) / offsetWidth;

    const _tickList = this.tickList.slice();
    _tickList.splice(this.activeIndex, 1, newValue);
    this.tickList = _tickList;
  }

  render() {
    const _tickProportionList = this.tickProportionList.slice();
    const lenght = _tickProportionList.length;
    const subSliderList = _tickProportionList
      .sort((a, b) => a - b)
      .reduce((prev: any[], curr, index) => {
        // 单刻度
        if (lenght === 1) {
          return [[0, curr]];
        }

        // 循环到最后一个刻度
        if (index === lenght - 1) {
          return prev;
        }

        const slider = [curr, _tickProportionList[index + 1]];
        return [...prev, slider];
      }, []);

    const paletteLength = this.palette.length;

    return html`
      <div
        class="slider"
        @pointerdown=${this.activateTick}
        @pointermove=${this.moveTick}
        @pointerup=${this.deactivateTick}
        draggable="false"
      >
        ${this.tickProportionList.map(
          (item, index) => html`
            <div
              class="tick ${this.activeIndex === index ? 'active' : 'inactive'}"
              style="
              left: calc(${item}% - calc(var(--tick-size, 22px) / 2))
            "
              data-index=${index}
              data-title=${this.tickList[index]}
              draggable="false"
            ></div>
          `
        )}
        ${subSliderList.map(
          (item, index) => html`
            <div
              class="subSlider"
              style="
              width: calc(${item[1] - item[0]}%);
              margin-left: calc(${index === 0 ? item[0] : '0'}%);
              background-color: ${this.palette[index % paletteLength]};
            "
              draggable="false"
            ></div>
          `
        )}

        <div
          class="curtain ${this.activeIndex === null ? 'hide' : 'show'}"
        ></div>
      </div>
    `;
  }
}
