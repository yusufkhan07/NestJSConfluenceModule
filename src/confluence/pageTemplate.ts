export const pageTemplate = `<h2><span style="color: rgb(101,84,192);"><ac:image><ri:url ri:value="{{{logo}}}" /></ac:image></span></h2>
<h1><strong><span style="color: rgb(101,84,192);">Week 13</span></strong></h1>
<h2><span style="color: rgb(0,0,0);"><strong>{{date}} | {{percentage}}%</strong></span></h2>
{{#each data}}
<p><br /></p>
<p><ac:image ac:align="left" ac:width="70"><ri:url ri:value="{{{this.image}}}" /></ac:image></p>
<h1><strong><span style="color: rgb(101,84,192);">{{this.title}}</span></strong></h1>
<p><br /></p><ac:task-list>
{{#each this.items }}
<ac:task>
<ac:task-id>{{inc @index}}</ac:task-id>
<ac:task-status>incomplete</ac:task-status>
<ac:task-body><span class="placeholder-inline-tasks" style="color: rgb(0,51,102);">{{this}}</span></ac:task-body>
</ac:task>
{{/each }}
</ac:task-list>
{{/each}}`;
