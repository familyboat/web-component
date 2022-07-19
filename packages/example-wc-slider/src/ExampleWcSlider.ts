import { LitElement, html, css } from 'lit';
import { state } from 'lit/decorators.js';
import '@familyboat/wc-slider/wc-slider.js';
import { mock, randInt } from './util.js';

export class ExampleWcSlider extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @state() addableTickList: number[] = [];

  @state() timeableTickList: number[] = mock(6);

  // eslint-disable-next-line no-undef
  timer: NodeJS.Timeout | undefined = undefined;

  addTick() {
    const _addableTickList = this.addableTickList.slice();
    this.addableTickList = [..._addableTickList, randInt(0, 100)];
  }

  deleteTick() {
    const _addableTickList = this.addableTickList.slice();
    _addableTickList.pop();
    this.addableTickList = _addableTickList;
  }

  updateTick(e: Event) {
    const { target } = e;
    const { content } = (target as HTMLElement).dataset;

    const update = () => {
      if (content === '更新') {
        this.timeableTickList = mock(6);
        this.timer = setTimeout(() => {
          update();
        }, 300);
        (target as HTMLElement).dataset.content = '停止';
        (target as HTMLElement).textContent = '停止';
      } else {
        clearTimeout(this.timer);
        (target as HTMLElement).dataset.content = '更新';
        (target as HTMLElement).textContent = '更新';
      }
    };

    update();
  }

  render() {
    return html`
      <h2>wc-slider 示例</h2>
      <dl>
        <dt>单刻度</dt>
        <dd><wc-slider .tickList=${[1]}></wc-slider></dd>
        <dt>双刻度</dt>
        <dd><wc-slider .tickList=${[1, 99]}></wc-slider></dd>
        <dt>多刻度</dt>
        <dd><wc-slider .tickList=${[1, 99, 67]}></wc-slider></dd>
      </dl>
      <dl>
        <dt>添加或删除刻度</dt>
        <dd>
          <button @click=${this.addTick}>添加</button>
          <button @click=${this.deleteTick}>删除</button>
          <wc-slider .tickList=${this.addableTickList}></wc-slider>
        </dd>
        <dt>渲染时序数据</dt>
        <dd>
          <button @click=${this.updateTick} data-content="更新">更新</button>
          <wc-slider .tickList=${this.timeableTickList}></wc-slider>
        </dd>
      </dl>
    `;
  }
}
