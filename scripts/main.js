const sibarMenuList = document.querySelectorAll('.admin-sidebbar > ul > li >a')
const height =document.querySelectorAll('.admin-sidebbar > ul > li >ul>div')

for (let index = 0; index < sibarMenuList.length; index++) {
    sibarMenuList[index].addEventListener('click',(event)=>{
        event.preventDefault()
        for (let a = 0; a < sibarMenuList.length; a++) {
            sibarMenuList[a].parentElement.children['1'].style.height = '0px' 
        }
        sibarMenuList[index].parentElement.children['1'].style.height = height[index].offsetHeight+'px'
    })
   
    
}

