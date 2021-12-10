"use strict";(self.webpackChunktaichi_orm=self.webpackChunktaichi_orm||[]).push([[775],{3247:(n,s,a)=>{a.r(s),a.d(s,{data:()=>e});const e={key:"v-d8ad4972",path:"/guide/concepts/orm.html",title:"ORM",lang:"en-US",frontmatter:{},excerpt:"",headers:[{level:2,title:"Usage",slug:"usage",children:[{level:3,title:"SQL client",slug:"sql-client",children:[]},{level:3,title:"Register Models",slug:"register-models",children:[]},{level:3,title:"Shutdown",slug:"shutdown",children:[]}]},{level:2,title:"More options",slug:"more-options",children:[]}],filePathRelative:"guide/concepts/orm.md",git:{updatedTime:1639159614e3,contributors:[{name:"Eddie Tang",email:"thfai2000@gmail.com",commits:5}]}}},3664:(n,s,a)=>{a.r(s),a.d(s,{default:()=>M});var e=a(6252);const p=(0,e.uE)('<h1 id="orm" tabindex="-1"><a class="header-anchor" href="#orm" aria-hidden="true">#</a> ORM</h1><p>Before getting started, you must create a ORM instance. The ORM instance is the root of your data logics. It provides <code>DatabaseContext</code> which are used to access the <code>ModelRepository</code>.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token constant">ORM</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;taichi-orm&#39;</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> orm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ORM</span><span class="token punctuation">(</span>ormConfig<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h2><h3 id="sql-client" tabindex="-1"><a class="header-anchor" href="#sql-client" aria-hidden="true">#</a> SQL client</h3><p>You must specify the <code>KnexConfig</code> in the ORMConfig</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> orm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ORM</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    models<span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token comment">//....</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// knex config with client sqlite3 / mysql / postgresql</span>\n    knexConfig<span class="token operator">:</span> <span class="token punctuation">{</span>\n        client<span class="token operator">:</span> <span class="token string">&#39;sqlite3&#39;</span><span class="token punctuation">,</span>\n        connection<span class="token operator">:</span> <span class="token punctuation">{</span>\n            filename<span class="token operator">:</span> <span class="token string">&#39;:memory:&#39;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre><div class="highlight-lines"><br><br><br><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h3 id="register-models" tabindex="-1"><a class="header-anchor" href="#register-models" aria-hidden="true">#</a> Register Models</h3><p>You must specify your <code>Models</code> in the ORMConfig</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> orm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ORM</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    <span class="token comment">// register the models here</span>\n    models<span class="token operator">:</span> <span class="token punctuation">{</span> \n        Model1RepoName<span class="token operator">:</span> Model1<span class="token punctuation">,</span> \n        Model2RepoName<span class="token operator">:</span> Model2\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    knexConfig<span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token comment">//...</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">// get ModelRepository</span>\n<span class="token keyword">let</span> <span class="token punctuation">{</span> Model1RepoName<span class="token punctuation">,</span> Model2RepoName <span class="token punctuation">}</span> <span class="token operator">=</span> orm<span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>repos\n\n<span class="token comment">// make query</span>\n<span class="token keyword">let</span> modelRecords <span class="token operator">=</span> <span class="token keyword">await</span> Model1RepoName<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token punctuation">{</span> where<span class="token operator">:</span> <span class="token punctuation">{</span>id<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n</code></pre><div class="highlight-lines"><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>The <code>models</code> are object with keys of <code>ModelRepository</code> names.</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>For convenience, we usually name the <code>ModelRepository</code> with the same names as corresponding <code>Models</code>.</p></div><p>If you put all your Model files in a directory, you can also register your models by given the directory path. The names of the <code>ModelRepository</code> will be the camel cases of their filenames with first letter captialized.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> orm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ORM</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    <span class="token comment">// Relative Path to the directory you run your nodejs runtime</span>\n    modelsPath<span class="token operator">:</span> <span class="token string">&#39;./models&#39;</span><span class="token punctuation">,</span>\n    knexConfig<span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token comment">//...</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre><div class="highlight-lines"><br><br><div class="highlight-line"> </div><br><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div>',14),t={class:"custom-container tip"},o=(0,e._)("p",{class:"custom-container-title"},"TIP",-1),l=(0,e.Uk)("It is suggested to use "),c=(0,e._)("code",null,"models",-1),i=(0,e.Uk)(" options to specify your "),r=(0,e._)("code",null,"Models",-1),u=(0,e.Uk)(" instead of "),d=(0,e._)("code",null,"modelsPath",-1),k=(0,e.Uk)(". If you use "),m=(0,e._)("code",null,"modelsPath",-1),b=(0,e.Uk)(", you will use lose typescript hints provided by "),h=(0,e._)("code",null,"Model API",-1),g=(0,e.Uk)(". Please see "),v=(0,e.Uk)("Typescript Support"),f=(0,e.Uk)("."),y=(0,e.uE)('<h3 id="shutdown" tabindex="-1"><a class="header-anchor" href="#shutdown" aria-hidden="true">#</a> Shutdown</h3><p>Shutdown the ORM instance gracefully when your application quits.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">await</span> orm<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="more-options" tabindex="-1"><a class="header-anchor" href="#more-options" aria-hidden="true">#</a> More options</h2><p>Here are all the options of ORM</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">ORMConfig<span class="token operator">&lt;</span>ModelMap <span class="token keyword">extends</span> <span class="token punctuation">{</span><span class="token punctuation">[</span>key<span class="token operator">:</span><span class="token builtin">string</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token keyword">typeof</span> Model<span class="token punctuation">}</span><span class="token operator">&gt;</span></span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token comment">// sql client connection</span>\n    knexConfig<span class="token operator">:</span> Omit<span class="token operator">&lt;</span>Knex<span class="token punctuation">.</span>Config<span class="token punctuation">,</span> <span class="token string">&quot;client&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;connection&quot;</span><span class="token operator">&gt;</span> <span class="token operator">&amp;</span> <span class="token punctuation">{</span>\n        client<span class="token operator">:</span> <span class="token builtin">string</span>\n        connection<span class="token operator">?</span><span class="token operator">:</span> Knex<span class="token punctuation">.</span>StaticConnectionConfig <span class="token operator">|</span> Knex<span class="token punctuation">.</span>ConnectionConfigProvider\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token comment">// object of Models</span>\n    models<span class="token operator">:</span> ModelMap\n    <span class="token comment">// the directory of the Model files</span>\n    modelsPath<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>\n    <span class="token comment">// output a SQL file of all schema</span>\n    outputSchemaPath<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>\n    <span class="token comment">// function to convert model name to table name</span>\n    entityNameToTableName<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>name<span class="token operator">:</span><span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">string</span><span class="token punctuation">,</span>\n    <span class="token comment">// function of convert property Name to field name</span>\n    propNameTofieldName<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>name<span class="token operator">:</span><span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">string</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div>',6),w={},M=(0,a(3744).Z)(w,[["render",function(n,s){const a=(0,e.up)("RouterLink");return(0,e.wg)(),(0,e.iD)(e.HY,null,[p,(0,e._)("div",t,[o,(0,e._)("p",null,[l,c,i,r,u,d,k,m,b,h,g,(0,e.Wm)(a,{to:"/guide/typescript-support.html#model-repository"},{default:(0,e.w5)((()=>[v])),_:1}),f])]),y],64)}]])},3744:(n,s)=>{s.Z=(n,s)=>{const a=n.__vccOpts||n;for(const[n,e]of s)a[n]=e;return a}}}]);