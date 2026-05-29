import React from 'react'

const CreateMsgModal = ({ openModal, setOpenModal }) => {


  return (
    <div className='questionModalTextArea'>
    <div style={{ fontSize: "3vh", padding: "2vw", lineHeight: "1vh" }} onClick={()=> setOpenModal(false)}>❎</div>
    <div style={{ textAlign: "center" }}>


        <h4 style={{ marginBottom: "4vh" }}><u>Usable Elements That Will Make Visible Changes To Your Message</u></h4>
        <div>Using these Elements allow you to give a message line breaks, special spacing, and colors, that you CAN NOT do by just typing. Allowing you to make your message more format specific and more professional. Admin Is the only one who can do this Action.</div>
        
        <ol style={{ background: "lightGrey", padding: "1vw" }}>
            <li><b>Heading</b> (SIX SELECTIONS ON HEADING SIZE (h1 - h6)) = <code>&lt;h1&gt;TEXT&lt;/h1&gt;</code></li>
            <br />
            <li><b>Space Between Sentences (BREAK)</b> = <code>&lt;br /&gt;</code></li>
            <li><b>Paragraph Indent (TAB SPACE)</b> = <code>&lt;span style="margin: 1vw;"&gt; NO TEXT&lt;/span&gt;</code></li>
            <li><b>Make Text Canter</b> = <code>&lt;span style="text-align: center;"&gt;TEXT&lt;/span&gt;</code></li>
            <div style={{ textAlign: "center" }}>"Note: For advanced formatting using inline styles, results may vary based on allowed styles and sanitization."</div>
            <li><b>Make A Container WITH A Border</b> = <code>&lt;div style="border: size solid color ;"&gt;TEXT&lt;/div&gt;</code></li>
            <li><b>Paragraph Area</b> = <code>&lt;p&gt;TEXT&lt;/p&gt;</code></li>
            <br />
            <li><b>Bold Text</b> = <code>&lt;b&gt;TEXT&lt;/b&gt;</code></li>
            <li><b>UnderLine Text</b> = <code>&lt;u&gt;TEXT&lt;/u&gt;</code></li>
            <li><b>Italic Text</b> = <code>&lt;i&gt;TEXT&lt;/i&gt;</code></li>
            <li><b>Color Text</b> = <code>&lt;span style="color: red;"&gt;Text&lt;/span&gt;</code></li>
            <li><b>Larger Text</b> = <code>&lt;span style="font-size: large;"&gt;Text&lt;/span&gt;</code></li>
            <li><b>Small Text</b> = <code>&lt;span style="font-size: small;"&gt;Text&lt;/span&gt;</code></li>
            <li><b>All Small-Caps Text</b> = <code>&lt;span style="font-variant: small-caps;"&gt;Text&lt;/span&gt;</code></li>
            <br />
            <li><b>Bulleted List</b> = <code>&lt;ul&gt;&lt;li&gt;Item 1&lt;/li&gt;&lt;li&gt;Item 2&lt;/li&gt;&lt;/ul&gt;</code></li>
            <li><b>Numbered List</b> = <code>&lt;ol&gt;&lt;li&gt;First&lt;/li&gt;&lt;li&gt;Second&lt;/li&gt;&lt;/ol&gt;</code></li>
            <br />
            <li><b>Hyper Link</b> = <code>&lt;a href="https://example.com"&gt;Link Name&lt;/a&gt;</code></li>
            <li><b>Email Link </b>= <code>&lt;a href="mailto:example@mail.com"&gt;example@mail.com&lt;/a&gt;</code></li>
            <li><b>Image</b> --- <u>Using A Link To Image</u> --- = <code>&lt;img src="https://example.com/image.png" alt="Description" /&gt;</code></li>
            <li><b>Image DIRECT LINK FOR AN UPLOADED IMAGE</b> --- <u>Using A Link To Image</u> --- = 
            <code>&lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt;</code>
            The imageFileId & imageBucketName are found under the image you upload in additionalImages. Just copy this id and bucket name and hard code the link and the image will show up.
            </li>
            
            <br />
            <li><b>Code Snippet</b> = <code>&lt;code&gt;some code&lt;/code&gt;</code></li>
        </ol>

        <ul><b><u>How Do You Get A HyperLink For Your Hyper Link</u></b>
            <li>1. Find WebSite</li>
            <li>2. Copy Website Link Example = http://example.com</li>
            <li>3. Paste Link In <code>&lt;a href="YOUR LINK HERE"&gt;Name Of The Link&lt;/a&gt;</code></li>
        </ul>

        <ul><b><u>How To Make Email Link</u></b>
            <li>1. Get Email</li>
            <li>2. Copy Email Example = example@mail.com</li>
            <li>3. Paste in Email <code>&lt;a href="mailto:YOUR EMAIL HERE"&gt;example@mail.com&lt;/a&gt;</code></li>
        </ul>

        <ul><b><u>How Do You Get A HyperLink For Your Image</u></b>
            <li>1. Find Image</li>
            <li>2. Right Click Image</li>
            <li>3. Select Copy Image Link</li>
            <li>4. Paste Link In <code>&lt;img ➡️src="YOUR LINK HERE"⬅️ /&gt;</code></li>
        </ul>

        <div>
            <b>Note:</b> Some elements like <code>&lt;script&gt;</code>, <code>&lt;iframe&gt;</code>, <code>&lt;form&gt;</code>, and input elements are not allowed for security reasons and will not work.
        </div>

        <div>
            <b>Note:</b> “Advanced styling with CSS works for most style attributes, but not all properties are supported or allowed. Preview your message before submitting.”
        </div>

        <div>
            <b>Note:</b> <a href='https://developer.mozilla.org/en-US/'>FOR MORE SUPPORT</a> On Using Elements
        </div>

        <div>
            <b>Note:</b> <a href='https://www.mongodb.com/docs/manual/support/'>FOR AI SUPPORT</a> On Using Elements
        </div>

    </div>

    <code>&lt;div style=" border: 10px double lime; background-color: antiqueWhite; "&gt;</code> =
    <div style={{ border: "10px double lime", background: "antiqueWhite", padding: "1vw" }}>
        <div><h4 style={{ textAlign: "center" }}><code>&lt;h4 style="text-align: center;"&gt;TEXT&lt;/h4&gt;</code> =
            <br /><u>HERE IS AN EXAMPLE</u></h4></div>
        <div >
            <span style={{ margin: "1vw" }}></span>
            <code>&lt;p&gt;</code><code>&lt;span style="margin: 1vw"&gt;&lt;/span&gt;</code> = "I HAVE TAB SPACE":
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero recusandae earum, nulla et animi error, ducimus excepturi iusto quo asperiores voluptatum. Hic sit provident,
            <code> &lt;b&gt;<b>TEXT</b>&lt;/b&gt;</code> = <b> "I AM BOLD" </b>
            dignissimos magni perferendis iure.
            <code>&lt;/p&gt;</code>
            <br />
            <code> &lt;br /&gt;</code> = "I HAVE A BREAK"
            <br />
            <code>&lt;p&gt;</code>Lorem, ipsum dolor sit amet consectetur adipisicing elit. <code>&lt;u&gt;TEXT&lt;/u&gt;</code> = <u>"I AM UNDERLINE"</u> magnam sequi architecto autem assumenda, ea expedita unde quia. Debitis voluptatum quo ipsam, totam exercitationem saepe repudiandae veniam libero nihil quibusdam laborum ducimus doloribus quis labore. Distinctio, harum? Amet <code>&lt;span style=" color: red; font-size: larger; font-variant: small-caps; "&gt;Text&lt;/span&gt;</code> = <span style={{ color: "red", fontSize: "larger", fontVariant: "all-small-caps" }}>I am red text, with Font Size Larger & All-small-caps </span>consequuntur et earum voluptate iusto.<code>&lt;/p&gt;</code>
            <br /> <br />

            <div style={{ textAlign: "center" }}>
                <div><code>&lt;a href="https://example.com"&gt;Link Name&lt;/a&gt;</code> = <a href="#">"I am A hyper Link"</a></div>

                <div>OR</div>

                <div><code>&lt;a href="mailto:example@mail.com"&gt;example@mail.com&lt;/a&gt;</code> = <a href="#">"email@mail.com"</a></div>
            </div>

        </div>
    </div><code>&lt;/div&gt;</code>
</div>
  )
}

export default CreateMsgModal
