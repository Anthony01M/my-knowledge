# Basics

### 1. Basic Structure of an HTML Document
Every HTML document follows a standard structure to ensure it is interpreted correctly by web browsers.
Here’s a minimal example:
~~~html
<!DOCTYPE html>
<html>
<head>
  <title>
    Page Title
  </title>
</head>
<body>
  <h1>Welcome to HTML!</h1>
  <p>This is a basic HTML document structure</p>
</body>
</html>
~~~
**Key Components**:
- `<!DOCTYPE html>`: Declares the document type as HTML5.
- `<html>`: The root element of the document.
- `<head>`: Contains metadata like the title and links to stylesheets.
- `<title>`: Sets the title of the page (appears on the browser tab).
- `<body>`: Contains the visible content of the webpage.
### 2. Tags and Elements
HTML is built using **tags** that define the purpose of the content.
- **Tag**: Keywords enclosed in angle brackets (`<tag>`).
- **Element**: A tag, its attributes, and the enclosed content.
  Example:
  ~~~html
  <p>This is a paragraph element.</p>
  ~~~
  1. `<p>` is the tag.
  2. The entire line is an element.
### 3. Attributes
Attributes provide additional information about HTML elements. They are written within the opening tag.

Example:
~~~html
<img src="image.jpg" alt="A descriptive text">
~~~
**Common Attributes**:
- `id`: Uniquely identifies an element.
- `style`: Applies inline CSS styles directly to an element.
  Example:
  ~~~html
  <p style="color: blue; font-size: 16px;">This paragraph has inline styles.</p>
  ~~~
  1. `class`: Assigns a class name for styling or scripting.
  2. `src`: Specifies the source of an image or media.
  3. `href`: Sets the URL for a link.
### 4. Nesting
Nesting means placing one element inside another to create a hierarchy.

Example:
~~~html
<div>
  <h1>Welcome</h1>
  <p>This is a nested paragraph.</p>
</div>
~~~
**Rules for Nesting**:
1. Always close tags in the correct order.
2. Proper indentation improves readability.
### 5. Comments
Comments are used to annotate the code without affecting the output. They are especially helpful for documentation.

Example:
~~~html
<!-- This is a comment -->
<p>This is a visible paragraph.</p>
~~~
**Note**:
1. Comments are ignored by the browser.
2. Comments are shown in Inspect Element (Windows/Linux: `CTR + SHIFT + I` | Mac: `CMD + OPTION + I`) and in Page Source (Windows/Linux: `CTR + U` | Mac: `CMD + U`).
