export class Point {
    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.scale = scale;
    }
    plus(that) {
        return new Point(this.x + that.x * this.scale, this.y + that.y * this.scale, this.scale * that.scale);
    }
    times(e) {
        if (this.scale === 1)
            return new Point(this.x * e, this.y * e, 1);
        if (e === 1)
            return this;
        const scale = Math.pow(this.scale, e);
        const ratio = (1 - scale) / (1 - this.scale);
        return new Point(this.x * ratio, this.y * ratio, scale);
    }
    neg() {
        return new Point(-this.x / this.scale, -this.y / this.scale, 1 / this.scale);
    }
    minus(that) {
        return this.plus(that.neg());
    }
    proj(scale) {
        return new Point(this.x, this.y, scale);
    }
    static dif(a, b) {
        return new Point((a.x - b.x) / b.scale, (a.y - b.y) / b.scale, a.scale / b.scale);
    }
    eq(that) {
        return (eq(this.x, that.x) && eq(this.y, that.y) && eq(this.scale, that.scale));
    }
    distanceFrom(that, base = Math.E) {
        return Math.hypot(this.x - that.x, this.y - that.y, (Math.log(this.scale) - Math.log(that.scale)) / Math.log(base));
    }
    /** scale the point from an origin according to the Poincaré metric */
    poincareInterpolateFrom(origin, height, rho) {
        const { asinh, acosh, sinh, cosh, exp, log, sqrt, tanh } = Math;
        // code from d3.js interpolateZoom
        const rho2 = rho * rho, rho4 = rho2 * rho2;
        const ux0 = origin.x, uy0 = origin.y, w0 = origin.scale * height, ux1 = this.x, uy1 = this.y, w1 = this.scale * height;
        const dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = sqrt(d2);
        const b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (w0 * rho2 * d1 * 2);
        const b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (w1 * rho2 * d1 * 2);
        const r0 = -asinh(b0);
        const r1 = -asinh(b1);
        const dr = r1 - r0;
        if (isNaN(dr)) {
            const S = log(w1 / w0) / rho;
            if (S === 0)
                return _ => origin;
            return x => new Point(ux0 + dx * x, uy0 + dy * x, (w0 * exp(rho * S * x)) / height);
        }
        const S = dr / rho;
        const coshr0 = cosh(r0);
        return x => {
            const s = S * x;
            const r = rho * s + r0;
            const u = (w0 / (rho2 * d1)) * (coshr0 * tanh(r) - sinh(r0));
            return new Point(ux0 + u * dx, uy0 + u * dy, (w0 * coshr0) / cosh(r) / height);
        };
    }
    /**
     * distance from another point according to the Poincaré metric
     * @param height = w / scale
     */
    poincareDistanceFrom(that, height, rho) {
        const { asinh, acosh, sinh, cosh, exp, log, sqrt, tanh } = Math;
        // code from d3.js interpolateZoom
        const rho2 = rho * rho, rho4 = rho2 * rho2;
        const ux0 = this.x, uy0 = this.y, w0 = this.scale * height, ux1 = that.x, uy1 = that.y, w1 = that.scale * height;
        const dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = sqrt(d2);
        const b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (w0 * rho2 * d1 * 2);
        const b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (w1 * rho2 * d1 * 2);
        const r0 = -asinh(b0);
        const r1 = -asinh(b1);
        const dr = r1 - r0;
        if (isNaN(dr)) {
            return log(w1 / w0) / rho;
        }
        return dr / rho;
    }
    toCSS() {
        return `translate(${this.x}px,${this.y}px)scale(${this.scale})`;
    }
}
export const ORIGIN = new Point(0, 0, 1);
const EPSILON = 0.000001;
function eq(a, b) {
    return a - b < EPSILON && b - a < EPSILON;
}
