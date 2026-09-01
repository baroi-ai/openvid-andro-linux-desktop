import { hexToRgba } from "@/lib/utils";
import { deriveSearchBg } from "@/lib/color.utils";
import { drawMagnifyIcon } from "@/lib/canvas-icons";
import type { MockupCanvasContext, MockupDrawResult } from "./types";
import { drawRoundedRectPath, drawMockupShadow } from "./shared";

export function drawMacosGhostIdeMockup(context: MockupCanvasContext): MockupDrawResult {
    const { ctx, x, y, width, height, config, cornerRadius, shadowBlur } = context;
    const isDark = config.darkMode;
    const frameColor = config.frameColor;
    const url = config.url || "openvid";
    const headerOpacity = config.headerOpacity ?? 100;
    const headerScale = (config.headerScale || 100) / 100;

    const headerHeight = 35 * headerScale;
    const menuFontSize = 12 * headerScale;
    const menuPaddingX = 8 * headerScale;
    const headerPaddingX = 12 * headerScale;
    const searchHeight = 22 * headerScale;
    const searchIconSize = 10 * headerScale;
    const searchFontSize = 11 * headerScale;
    const searchGap = 6 * headerScale;
    const searchBorder_ = "rgba(255,255,255,0.1)";
    const dotSize = 12 * headerScale; // w-3 h-3
    const dotGap = 6 * headerScale;

    const bgColor = isDark ? "#1e1e1e" : "#f3f3f3";
    const borderColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)";
    const textColor = isDark ? "#cccccc" : "#333333";
    const menuColor = isDark ? "#999999" : "#555555";
    const searchBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.15)";
    const searchBgBase = deriveSearchBg(frameColor);
    const hamburgerColor = isDark ? "rgba(163,163,163,0.8)" : "rgba(100,100,100,0.8)";
    const dotBorderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";

    drawMockupShadow(ctx, x, y, width, height, cornerRadius, shadowBlur);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + headerHeight);
    ctx.lineTo(x + width, y + headerHeight);
    ctx.lineTo(x + width, y + height - cornerRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
    ctx.lineTo(x + cornerRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.lineTo(x + width - cornerRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
    ctx.lineTo(x + width, y + headerHeight);
    ctx.lineTo(x, y + headerHeight);
    ctx.lineTo(x, y + cornerRadius);
    ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
    ctx.closePath();
    ctx.fillStyle = hexToRgba(frameColor, headerOpacity);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + headerHeight);
    ctx.lineTo(x + width, y + headerHeight);
    ctx.stroke();
    ctx.restore();

    const midY = y + headerHeight / 2;
    const dotsStartX = x + headerPaddingX;

    [0, 1, 2].forEach((i) => {
        const cx = dotsStartX + i * (dotSize + dotGap) + dotSize / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, midY, dotSize / 2, 0, Math.PI * 2);
        ctx.strokeStyle = dotBorderColor;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    });

    const menuItems = width >= 500 * headerScale
        ? ["File", "Edit", "Selection", "View", "Go"]
        : ["File", "Edit", "Selection"];
    const dotsRightX = dotsStartX + 3 * dotSize + 2 * dotGap;
    let menuX = dotsRightX + 8 * headerScale;

    ctx.save();
    ctx.font = `${menuFontSize}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillStyle = menuColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    menuItems.forEach((item) => {
        ctx.fillText(item, menuX + menuPaddingX, midY);
        menuX += ctx.measureText(item).width + menuPaddingX * 2;
    });
    ctx.restore();

    const hamW = 14 * headerScale;
    const hamH = 1.5 * headerScale;
    const hamGap = 3.5 * headerScale;
    const hamX = x + width - headerPaddingX - hamW;
    const hamY0 = midY - hamGap - hamH / 2;

    ctx.save();
    ctx.fillStyle = hamburgerColor;
    ctx.beginPath();
    ctx.roundRect(hamX, hamY0, hamW, hamH, hamH / 2);
    ctx.roundRect(hamX, hamY0 + hamGap, hamW, hamH, hamH / 2);
    ctx.roundRect(hamX, hamY0 + hamGap * 2, hamW, hamH, hamH / 2);
    ctx.fill();
    ctx.restore();

    const rightReservedX = x + width - (80 * headerScale);
    const maxSearchWidth = Math.min(width * 0.45, 400 * headerScale);
    const searchY = y + (headerHeight - searchHeight) / 2;

    const minSearchX = menuX + 8 * headerScale;
    const maxSearchRight = rightReservedX - 8 * headerScale;

    let searchX = x + (width - maxSearchWidth) / 2;
    let searchWidth = maxSearchWidth;

    if (searchX < minSearchX) {
        searchX = minSearchX;
    }
    if (searchX + searchWidth > maxSearchRight) {
        searchWidth = Math.max(40 * headerScale, maxSearchRight - searchX);
    }

    if (searchWidth > 30 * headerScale) {
        ctx.save();
        drawRoundedRectPath(ctx, searchX, searchY, searchWidth, searchHeight, 4 * headerScale);
        ctx.fillStyle = hexToRgba(searchBgBase, headerOpacity);
        ctx.fill();
        ctx.strokeStyle = searchBorder;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        drawRoundedRectPath(ctx, searchX, searchY, searchWidth, searchHeight, 4 * headerScale);
        ctx.clip();

        ctx.font = `${searchFontSize}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;
        const displayUrl = url || "openvid";
        const textW = ctx.measureText(displayUrl).width;
        const groupW = searchIconSize + searchGap + textW;
        const groupStartX = searchX + Math.max(8 * headerScale, (searchWidth - groupW) / 2);
        const iconY = searchY + (searchHeight - searchIconSize) / 2;

        drawMagnifyIcon(ctx, groupStartX, iconY, searchIconSize, textColor + "80");

        ctx.fillStyle = textColor;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(displayUrl, groupStartX + searchIconSize + searchGap, searchY + searchHeight / 2);
        ctx.restore();
    }

    return {
        contentX: x,
        contentY: y + headerHeight,
        contentWidth: width,
        contentHeight: height - headerHeight,
    };
}