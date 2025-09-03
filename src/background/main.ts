// src/background/main.ts
console.log("Background service worker loaded");

// 监听扩展安装
chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension installed");
});

// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Received message:", message);
	// 处理消息
	sendResponse({ status: "ok" });
});

// 监听 action 点击（如果没有 popup）
chrome.action.onClicked.addListener((tab) => {
	console.log("Extension clicked");
});
