# 📧 Gmail Script Collection
A repository of Google Apps Script utilities for enhancing Gmail automation and processing.
<p align="center">
  <img src="https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google-script&logoColor=white" alt="google apps script">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

## 🛠️ Installation Guideline
### 1. Create New Script Project
1. Visit [Google Apps Script](https://script.google.com)
2. Click **+ New Project** in top-left corner
3. Delete default code from `Code.gs` (if present)
### 2. Implement The Collections

1. Browse the [script collection](/gmail/scripts/collection/)
2. Select desired script
3. Copy entire script content
4. Back in Google Script:
      - Click **+ File** ➕ → **Script**
      - Name file matching script purpose
      - Paste copied code
5. Repeat for additional scripts
### 3. Configure Script
Each script has different type of configuration, please read the first few lines to know what you need to modify..
~~~javascript
/**
 * Description
 * @requires Services used
 * @configuration you have to modify
*/
~~~
### 4. Initial Setup & Authorization
> ⚠️ Please first manually review the script, do not blindly allow permissions
1. Run initialization function:
    - Select `createTrigger` from function dropdown ▾
    - Click **Run** ▶️
2. Accept permissions:
    - **Review Permissions** → Choose account
    - **Advanced** → **Go to Project (unsafe)**
    - **Allow** all permissions
