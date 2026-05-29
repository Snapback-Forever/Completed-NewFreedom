import React, { useState } from 'react'

const TermsModal = ({ openLogin, setOpenLogin, openTerms, setOpenTerms, openRegister, setOpenRegister }) => {

    const dontAgreeToTerms = ()=> {
        setOpenLogin(false)
        setOpenTerms(false)
        setOpenLogin(false)
    }

    const cancelRegister = () => {
        setOpenLogin(false)
        setOpenTerms(false)
        setOpenLogin(false)
   }

    return (

        <div className='termsModal scrollBar'>
            <div className='w-full'>
                <button onClick={cancelRegister} style={{ fontSize: "2rem" }} >❎</button>
            </div>

            <h1 className='text-center'><u>Terms & Conditions</u></h1>
            <div className='w-full bg-gray-100 overflow-y-scroll p-px' style={{ height: "85%" }}>

                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem voluptatibus nesciunt similique voluptatum laudantium consequatur nulla temporibus quod, quasi ab laborum velit eaque in delectus minima nisi pariatur ea officia non suscipit praesentium! Impedit voluptas qui sequi alias voluptate a incidunt soluta hic aspernatur, consectetur non. Est quisquam quis recusandae corporis accusantium blanditiis cupiditate eos veniam aut voluptatibus, rerum corrupti consequatur praesentium reprehenderit laudantium quam culpa dolores neque ea hic deleniti atque quo. Corrupti adipisci modi consequuntur tempore qui repellendus mollitia, provident nulla, aperiam molestias est maxime, totam blanditiis magnam optio! Quas, ut, consequuntur deleniti sunt voluptates reprehenderit sapiente possimus explicabo labore voluptatum dicta distinctio error at harum aut eos rerum nihil repellendus odio fugit iste? Eligendi iusto et aliquid aut quis voluptate consectetur veritatis quas eveniet maxime quia dolorum animi fuga, nemo esse necessitatibus, excepturi aspernatur officiis, nostrum ullam tempora sint soluta eos rem. Sint quis commodi exercitationem sit voluptas iure optio, rerum rem atque quos odit hic minus at deserunt ratione id voluptatem omnis temporibus modi, dolor facilis incidunt. Enim, exercitationem dicta ratione omnis numquam facere ullam veniam nam impedit quis nostrum reprehenderit ea quasi aliquam at cumque velit eligendi maxime facilis quisquam? Ab tempora, minima doloremque, magni natus sint ullam debitis perferendis optio autem sunt alias nisi saepe quidem reiciendis, aspernatur maxime praesentium laborum. Optio alias expedita omnis, repellendus vero, nisi dolor ut at ab perspiciatis minima similique quae. Illum, omnis. Optio deleniti accusantium vitae atque iure modi doloribus, incidunt error minima voluptas nam laudantium reiciendis delectus!</div>

                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates consequatur illo voluptate dignissimos veritatis quia minima? Omnis laboriosam inventore odio explicabo ut nam magni laudantium necessitatibus quae, incidunt harum reiciendis. Ea ratione, aut officia numquam neque quisquam, totam nihil sapiente suscipit perspiciatis optio eius sunt praesentium nesciunt maiores beatae dolor magnam harum veritatis tempora! Obcaecati voluptates ea, voluptate dolorum et aspernatur expedita doloremque consectetur, commodi id reprehenderit qui corporis distinctio molestiae voluptatem sapiente quisquam ullam animi inventore est exercitationem nemo delectus libero? Reprehenderit laborum cum sed quas facilis. Mollitia deserunt impedit necessitatibus asperiores ducimus quidem pariatur eius molestiae saepe molestias quo doloremque veritatis vitae, modi magni. Porro soluta excepturi perspiciatis deserunt, nobis natus sint itaque perferendis ab in recusandae sunt saepe voluptatum ducimus esse ea maxime, numquam commodi neque eos qui ipsa optio voluptates rerum? Repellat necessitatibus non consequuntur ratione! Accusamus recusandae doloremque impedit dolores iste autem? Sunt, sed error ipsam commodi maxime, optio nulla voluptatibus dolores doloremque, facilis repellendus necessitatibus minus cumque! Maxime nam iure vitae adipisci asperiores voluptatem deserunt, id quas earum accusantium perspiciatis, illo nobis dolor optio quis debitis aliquam obcaecati quisquam explicabo corrupti quod error. Vel nesciunt quos, quisquam laboriosam totam, ut dolore, deserunt modi nisi voluptatibus cum voluptas sunt repellat? Tenetur placeat consequatur facilis maxime hic ipsa? Perspiciatis quidem minus dolorum quod corrupti impedit ad, dicta vitae delectus quam blanditiis sunt cumque maxime reiciendis hic veniam sed neque repudiandae laudantium fugit magnam. Enim, corrupti culpa maiores laborum, ad ex nesciunt incidunt assumenda alias velit labore repudiandae temporibus dolorum repellat expedita atque odio doloribus quidem necessitatibus unde illum ipsa. Fugiat deleniti corrupti reiciendis saepe, reprehenderit sapiente error a, nobis necessitatibus, ab placeat! Provident vitae deserunt, officiis, vero ratione et blanditiis culpa nihil, fugiat perspiciatis fugit. Maiores, id fugiat modi, quidem neque, consectetur commodi tenetur nostrum ex vero a eaque dicta voluptatibus dolores placeat? Maiores facere qui tempora sit aliquid sed non dolorum dolores molestiae fugiat quos quasi eos mollitia, consectetur natus excepturi itaque dolor eaque suscipit quo, obcaecati placeat, eum pariatur? Eos quasi blanditiis natus optio laboriosam dolorum, ipsum nulla asperiores, repellendus incidunt temporibus a nostrum.</div>

            </div>

            <div className='flex flex-col'>

                <button style={{ margin: "1vh 2vw 1vh 1vw", color: "black" }} className=' bg-green-500 p-2 rounded' onClick={()=> setOpenRegister(true)}>I AGREE</button>

                <button style={{ margin: "0vh 2vw 1vh 1vw", color: "black" }} className=' bg-red-600 p-2 rounded' onClick={dontAgreeToTerms}>I DO NOT AGREE</button>

            </div>

        </div>

    )
}

export default TermsModal
