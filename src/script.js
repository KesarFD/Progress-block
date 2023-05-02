var firstTimer, secondTimer;

class ProgressBlock {
  constructor(container) {
    this._create(container);
  }

  _create(container) {
    this.root = document.createElement("div");
    this.root.classList.add("container");

    this.root.insertAdjacentHTML(
      "beforeend",
      `
      <svg class="progress-ring" width="120" height="120">
        <circle
          class="ring-circle"
          stroke="#2925db"
          stroke-width="4"
          cx="60"
          cy="60"
          r="52"
          fill="transparent"
        />
      </svg>
      <div class="input-wrapper">
        <div class="inputs">
          <input type="number" class="value" min="1" max="100" />
          <input type="checkbox" id="Animate" />
          <input type="checkbox" id="Hide" />
        </div>
        <div class="names">
          <h3>Value</h3>
          <h3>Animate</h3>
          <h3>Hide</h3>
        </div>
      </div>
    `
    );

    container.appendChild(this.root);

    this.hideCheckbox = document.getElementById("Hide");
    this.animateCheckbox = document.getElementById("Animate");

    this.circle = this.root.querySelector(".ring-circle");
    this.radius = this.circle.r.baseVal.value;
    const circleLength = 2 * Math.PI * this.radius;

    this.circle.style.strokeDasharray = `${circleLength} ${circleLength}`;
    this.circle.style.strokeDashoffset = circleLength;
    this.circleLength = circleLength;

    this.input = this.root.querySelector(".value");
    this.setProgress(100);

    this._addEventHandlers();
  }

  setProgress(value) {
    this.input.value = value;
    const offset = this.circleLength - (value / 100) * this.circleLength;
    this.circle.style.strokeDashoffset = offset;
  }

  setVisibility(isVisible) {
    this.hideCheckbox.checked = isVisible;
    if (isVisible) {
      this.circle.style["display"] = "none";
    } else {
      this.circle.style["display"] = "block";
    }
  }

  setAnimated(isAnimated) {
    this.animateCheckbox.checked = isAnimated;
    const value = this.input.value;
    if (isAnimated) {
      this.setProgress(0);
      firstTimer = setInterval(() => {
        this.setProgress(value);
      }, 1500);
      secondTimer = setInterval(() => {
        this.setProgress(0);
      }, 3000);
    } else {
      clearInterval(firstTimer);
      clearInterval(secondTimer);
      this.setProgress(value);
    }
  }

  _addEventHandlers() {
    const input = this.root.querySelector(".value");
    input.addEventListener("change", () => {
      if (input.value < 0 || input.value > 100) {
        alert("Значение должно быть от 1 до 100!");
      } else {
        this.setProgress(input.value);
      }
    });

    window.addEventListener("orientationchange", () => {
      if (window.orientation !== 0) {
        this.root.style.width = "300px";
        this.root.style["flex-direction"] = "row";
      } else {
        this.root.style.width = "300px";
        this.root.style["flex-direction"] = "column";
      }
    });

    this.hideCheckbox.addEventListener("change", () => {
      this.setVisibility(this.hideCheckbox.checked);
    });

    this.animateCheckbox.addEventListener("change", (e) => {
      this.setAnimated(this.animateCheckbox.checked);
    });
  }
}

const block = new ProgressBlock(document.body);
