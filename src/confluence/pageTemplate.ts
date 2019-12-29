export const pageTemplate = `<h2><span style="color: rgb(101,84,192);"><ac:image><ri:url ri:value="{{{logo}}}" /></ac:image></span></h2>
<h1><strong><span style="color: rgb(101,84,192);">{{title}}</span></strong></h1>
<h2><span style="color: rgb(0,0,0);"><strong>{{date}} | {{percentage}}%</strong></span></h2>
<p><br /></p>
<p><ac:image ac:align="left" ac:width="60"><ri:url ri:value="https://github.com/NoumanDilshad/images/blob/master/banner.png?raw=true" /></ac:image></p>
<h1><strong><span style="color: rgb(101,84,192);">Action Items</span></strong></h1>
<p><br /></p>
<ac:task-list>
{{#each actionItems}}
<ac:task>
<ac:task-id>{{inc @index}}</ac:task-id>
<ac:task-status>incomplete</ac:task-status>
<ac:task-body><span class="placeholder-inline-tasks" style="color: rgb(0,51,102);">{{this.text}}</span></ac:task-body>
</ac:task>
{{/each}}
</ac:task-list>
<p><br /></p>
<p><ac:image ac:align="left" ac:width="60"><ri:url ri:value="https://github.com/NoumanDilshad/images/blob/master/four%20squares.png?raw=true" /></ac:image></p>
<h1><strong><span style="color: rgb(101,84,192);">Retrospective</span></strong></h1>
<h2><span style="color: rgb(153,153,153);"><strong>&nbsp;</strong></span></h2>
{{#each retrospective}}
<h2><span style="color: rgb(153,153,153);"><strong>{{this.title}}</strong></span></h2>
<ul>
{{#each this.items }}
<li>{{this}}</li>
{{/each }}
</ul>
{{/each}}`;
