let names = ['Olatunji', 'Sochi', 'Simi', 'Tolu', 'Bolu']

function signup(newuser){
    names.push(newuser)

}
signup('Alex')
function PrintName(name){
    console.log(name)
}
names.forEach(PrintName)
names.forEach((name) => {
    console.log(name)
})