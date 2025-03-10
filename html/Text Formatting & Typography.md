# Text Formatting & Typography

### Introduction
Formatting text in HTML is essential for enhancing readability and structuring content. HTML provides various tags to style text, including bold, italics, underlines, and more.
### 1. Basic Text Formatting
HTML includes several inline elements for text formatting.
Example:
~~~html
<p>This is a <b>bold</b> word, an <i>italic</i> word, and an <u>underlined</u> word.</p>
~~~
#### Common Formatting Tags:
1. `<b>`: Makes text <b>bold</b> (*no semantic meaning*).
2. `<strong>`: Makes text <strong>bold</strong> (*semantic meaning*).
3. `<i>`: Makes text <i>italic</i> (*no semantic meaning*). 
4. `<em>` Makes text <em>italic</em> (*emphasis/semantic meaning*).
5. `<u>`: Makes text <u>underlined</u>. 
### 2. Superscript and Subscript
HTML includes one element for subscript and another for superscript, both of which are used in mathematical expressions or footnotes.
Example:
~~~html
<p>Water is written as H<sub>2</sub>O.</p>
<p>5<sup>2</sup> = 25</p>
~~~
1. `<sub>`: Displays text as subscript (Result: H<sub>2</sub>O).
2. `<sup>`: Displays text as superscript (Result: 5<sup>2</sup>).
### 3. Preformatted Text
The `<pre>` tag preserves spaces, line breaks, and indentation. It is typically used for displaying code snippets or [ASCII art](https://en.wikipedia.org/wiki/ASCII_art).
Example:
~~~html
<pre>
  This    text will 
  keep its   spaces
  and line breaks.
</pre>
~~~
### 4. Understanding Inline and Block Elements
In flow layout, it is important that you understand how the elements behave:
1. **Inline Elements**: Do not start on a new line and only take up as much width as necessary.
   **Example Elements**: `<b>`, `<i>`, `<span>`, `<a>`, `<img>`.
2. **Block Elements**: Start on a new line and take up full width.
   **Example Elements**: `<p>`, `<div>`, `<h1>` ➜ `<h6>`, `<ul>`, `<table>`.
Example:
~~~html
<p>This is a block element.</p>
<span>This is an inline element.</span>
~~~
