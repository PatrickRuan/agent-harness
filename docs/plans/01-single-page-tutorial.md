# 教學頁：從聊天玩具到 Agent —— Harness 到底是什麼

> **註（非原文）**：這份計畫原本存放在 `~/.claude/plans/`，但該檔案在後續規劃時被整份覆寫。
> 此處內容是從當時的對話記錄還原的核准版本，內容與當初核准時一致。詳見 [README](README.md)。

## Context（為什麼做這個）

使用者想確認他對「AI 演進脈絡」的理解是否正確（早期 20-30 行 Python 聊天 → Agent 能與世界互動 → Harness 成為顯學 → Agent = Model + Harness），並附上一段 Gemini 的回答請我糾正。接著要把正確的脈絡做成一個**白話、互動式的單頁教學**，風格參考 [mnist-knob-lab](https://patrickruan.github.io/mnist-knob-lab/)（單一自包含 HTML、分章節、講解＋互動 demo、最後一章說明「這頁怎麼做的」），並附上早期呼叫 OpenAI API 的 Python 示範程式。

工作目錄 `/Users/patrickruan/Dev/claude-code/agent-harness` 目前是空的（只有 `.claude`），從零建立。成品可日後推上 GitHub Pages，如同參考頁。

### 技術判斷：使用者的直覺大致正確；Gemini 版本要做 6 處修正

使用者的四段推論**方向都對**，Gemini 的回答是不錯的科普，但有幾處需要修正，這些修正會直接寫進教學頁的「澄清 / 糾錯」章節：

1. **「概念」與「名詞」要分開**：那層薄薄的 wrapper（概念）早期就存在；但 **harness 這個「詞」被廣泛使用是近一兩年（2024–2025）** 才在 agent／eval／coding agent 的討論裡流行起來。使用者 Q3 的直覺（以前就有、最近才顯學）比 Gemini 精準。
2. **Agent 的核心是「迴圈 loop」，不只是「裝上工具」**：定義 Agent 的關鍵是 **model 決定動作 → harness 執行 → 把結果餵回 → model 再決定**，反覆直到完成。Gemini 有提 ReAct 但公式把「迴圈」這個靈魂講淡了。
3. **「中階模型靠 harness 超越高階模型」講得太滿**：較準確的說法是「**同一個模型在不同 harness 下，表現天差地遠**；harness 的品質有時和模型品質一樣重要」，而非普遍能翻盤。
4. **LangChain / AutoGen / CrewAI 是 framework（幫你蓋 harness 的工具），不等於 harness 本身**；harness 更偏指「圍繞模型的那層 loop＋工具派發＋脈絡組裝」。
5. **MCP 是「連接工具/資料的協定」，不是「多 agent 協作架構」**，Gemini 的歸類不精確。
6. **Multi-agent 不是「演進的完全體」**：它是一種架構取捨，常常更脆弱、更難除錯；不代表比單 agent 更高級。另補一個 Gemini 幾乎沒提、但現代 harness 最吃重的工作：**脈絡管理（context management）**——決定每一輪把什麼塞進有限的 context window。

我的看法（會在回覆中直接說）：**這個設計有用**。把「Model vs Harness」這條界線用可互動的方式講清楚，正好打中大多數人對 Agent 的模糊點；配合真實可跑的 Python 程式碼當錨點，教學價值高。

## 決策（已與使用者確認）

- 互動程度：**中度互動**（前端模擬，不真的連 API）。
- 程式範例：**附真實可複製可跑的 OpenAI Python 程式碼**，但頁面內互動用前端模擬示範。
- 語言：繁體中文。

## 交付物

單一自包含檔案：`/Users/patrickruan/Dev/claude-code/agent-harness/index.html`
- 純 HTML + inline CSS + vanilla JS，**零外部相依**（可離線開、可直接丟 GitHub Pages）。
- 淺色為主、乾淨卡片式版面，章節導覽（tab / 分章），呼應參考頁氣質但不照抄。
- 響應式：手機也能讀，程式碼區塊可橫向捲動。

### 章節規劃（tabs）

- **① 一句話總結**：`Agent = Model + Harness`。Model＝大腦（理解、推理、決定下一步）；Harness＝骨架＋神經＋工具箱（組裝脈絡、派發工具、跑迴圈、控邊界）。一張對照圖。
- **② 最原始的樣子：20–30 行 Python 聊天**
  - 白話講：模型只是「文字接龍機」，那 30 行就是第一代 harness（設定 system prompt、堆 `messages` 陣列、呼叫、印出）。
  - **互動 demo**：使用者在輸入框打字，畫面即時展示 `messages[]` 陣列怎麼一則一則長大（純前端模擬）。
  - **真實程式碼**：可複製的 OpenAI Python 範例（現代 `openai` SDK 的 `chat.completions.create` 迴圈版），旁註老寫法差異。
- **③ 裝上手腳：Tool use ＝ 這才叫 Agent**
  - 展示一個 tool 的 JSON schema（例：`get_weather(city)`）→ 模型輸出 `tool_call` → harness 攔截、實際執行、把結果餵回 → 模型給最終答案。
  - **互動 demo**：「台北現在幾度？」的**逐步步進器**（下一步按鈕），把 think → tool_call → harness 執行 → observe → 回答一步步攤開。
- **④ 靈魂是「迴圈」**：把 ③ 抽象成 think→act→observe→repeat 的循環動畫，強調 Agent ≠ 一問一答，而是會自己迭代到完成。
- **⑤ 為什麼 Harness 最近變顯學**
  - 白話：模型單靠自己撞牆後，靠 harness 的技巧（脈絡管理、重試、反思 reflection、RAG、子 agent 分工）把可靠度與品質拉高。
  - **互動 demo**：同一個「模型」跑陽春 harness vs 精緻 harness 的**對比切換**，看輸出品質差異（模擬示意）。
- **⑥ 澄清 / 糾錯**：用「常見說法 vs 更精準的說法」對照表，收進上面 6 點修正（尤其：概念 vs 名詞、迴圈才是核心、harness≠framework、MCP 定位、multi-agent 不是完全體、脈絡管理）。
- **⑦ 這頁怎麼做的**（使用者要求的「tab」）：說明用 Claude Code 的 plan mode 規劃、單一自包含 HTML 的取捨、為何用前端模擬而非真連 API、如何丟上 GitHub Pages。呼應參考頁最後一章的「vibe coding」精神。

## 實作要點

- 一個檔案內：頂部固定章節導覽（點擊切換 section 或平滑捲動）；每章「講解卡片 + 互動區」兩段式。
- JS 只用原生 DOM；狀態存在模組內變數。三個互動：`messages[]` 堆疊、Agent loop 步進器、harness 對比切換。
- 程式碼區塊用 `<pre><code>`，配「複製」按鈕；深淺色皆可讀。
- Python 範例需**真實可跑**（現代 openai SDK），並清楚標示 `api_key` 要自己填。

## 驗證方式

1. 用瀏覽器（in-app Browser 工具或 `preview_start` 開本機檔）開啟 `index.html`，逐章確認：
   - ② 打字時 `messages[]` 陣列即時增長。
   - ③ 步進器每按一次正確前進一步、到最終回答。
   - ⑤ 對比切換能看到兩種輸出差異。
   - 章節導覽切換正常、手機寬度不破版、程式碼區塊可橫捲。
2. 檢查主控台無 JS 錯誤（`read_console_messages`）。
3. 確認整檔零外部請求（離線可開）。
4. （可選）另以 Artifact 發佈一份預覽連結給使用者快速檢視；正式落點仍是 repo 內 `index.html` 以便推 GitHub Pages。
