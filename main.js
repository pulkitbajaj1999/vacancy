import STATIC_DATA from './combine.js'

let allData = STATIC_DATA
let selectedData = []
// curr state
let stateData = []
let currTab = 0

// for filtering
let currBlock = 'All'
let searchedString = ''

// page
let page = 1
const PAGE_ITEMS = 100

// html elements
const saveBtn = document.querySelector('.controls__container button.save')
const viewTab = document.querySelector('.active-tabs__container .view button')
const selectionTab = document.querySelector(
    '.active-tabs__container .selection button'
)
const arrangeBtn = document.querySelector('.controls__container button.arrange')
const searchInput = document.querySelector('.searchbox')

const paginationContent = document.querySelector(
    '.control-section.pagination span'
)
const nextPage = document.querySelector(
    '.control-section.pagination .next-page'
)
const prevPage = document.querySelector(
    '.control-section.pagination .prev-page'
)

const dropdown = document.getElementById('dynamicDropdown')

function updateView(escapeFilter = false) {
    console.log('updating===========>' + Math.random())
    if (escapeFilter === false) {
        switch (currTab) {
            case 0: {
                stateData = getfilteredData(allData)
                arrangeBtn.disabled = true
                populateDropdown(allData)
                break
            }
            case 1: {
                stateData = getfilteredData(selectedData)
                arrangeBtn.disabled = false
                populateDropdown(selectedData)
                break
            }
            default: {
                stateData = getfilteredData(allData)
            }
        }
    }
    let totalItems = stateData.length
    let totalPages = Math.ceil(totalItems / PAGE_ITEMS)
    page = Math.min(page, totalPages)
    page = Math.max(1, page)
    // left, right index is inclusive at both ends
    let left = (page - 1) * PAGE_ITEMS
    let right = Math.min(left + PAGE_ITEMS - 1, totalItems - 1)
    paginationContent.textContent = `Page ${page} of ${totalPages}`
    updateList(stateData, left, right)
}

function updateList(data, left, right) {
    let body = document.querySelector('.choices__container .body')
    function isSelected(id) {
        return selectedData.find((el) => String(el.id) === String(id))
            ? true
            : false
    }
    body.innerHTML = ''
    for (let i = left; i <= right; i++) {
        let row = data[i]
        let html = `
            <div class="column serial">${i + 1}</div>
            <div class="column school">${row.schoolName}</div>
            <div class="column block">${row.block}</div>
            <div class="column district">${row.dist}</div>
            <div class="column distance">
                <input id="${row.id}" type="text" value="${row.distance}" ${
            currTab === 1 ? 'disabled' : ''
        }/>
            </div>
            <div class="column selected">
                <input id="${row.id}" type="checkbox" ${
            isSelected(row.id) ? 'checked' : ''
        }/>
            </div>
            <div class="column priority">
                <input id="${row.id}" type="text" value="${
            row.priority || ''
        }" ${currTab === 0 ? 'disabled' : ''}/>
            </div>
        `
        let choice = document.createElement('div')
        choice.classList.add('choice')
        choice.innerHTML = html

        // adding event handler for selection
        let selectedInput = choice.querySelector('.column.selected input')
        selectedInput.addEventListener('change', (event) => {
            let id = event.target.id
            let flag = event.target.checked ? true : false
            function isSelected(id) {
                return selectedData.find((el) => String(el.id) === String(id))
                    ? true
                    : false
            }
            if (flag && !isSelected(id)) {
                selectedData.push(row)
            } else if (!flag && isSelected(id)) {
                selectedData = selectedData.filter(
                    (el) => String(el.id) !== String(id)
                )
            }
        })

        // adding event handler for priority
        let priorityInput = choice.querySelector('.column.priority input')
        priorityInput.addEventListener('change', (event) => {
            let regex = /^[1-9]\d*$/
            if (event.target.value.match(regex)) {
                let index = selectedData.findIndex(
                    (el) => String(el.id) === String(event.target.id)
                )
                if (index >= 0) {
                    selectedData[index].priority = parseInt(event.target.value)
                } else event.target.value = ''
            } else {
                event.target.value = ''
                let index = selectedData.findIndex(
                    (el) => String(el.id) === String(event.target.id)
                )
                if (index >= 0) selectedData[index].priority = ''
            }
        })

        let distanceInput = choice.querySelector('.column.distance input')
        distanceInput.addEventListener('change', (event) => {
            let regex = /^[1-9]\d*$/
            if (event.target.value.match(regex)) {
                let index = allData.findIndex(
                    (el) => String(el.id) === String(event.target.id)
                )
                if (index >= 0) {
                    allData[index].distance = parseInt(event.target.value)
                } else event.target.value = ''
            } else {
                event.target.value = ''
                let index = allData.findIndex(
                    (el) => String(el.id) === String(event.target.id)
                )
                if (index >= 0) allData[index].distance = ''
            }
        })
        body.appendChild(choice)
    }
}

function getfilteredData(data) {
    let blockFiltered = data.filter((el) => {
        if (currBlock === 'All') return true
        else return el.block.toLowerCase() === currBlock.toLowerCase()
    })

    let searchFiltered = blockFiltered.filter((el) => {
        if (searchedString.trim() === '') return true
        else
            return el.schoolName
                .toLowerCase()
                .includes(searchedString.toLowerCase())
    })
    return searchFiltered
}

// Function to populate the dropdown
function populateDropdown(data) {
    let blocks = data.reduce((res, el) => {
        if (!res.includes(el.block)) res.push(el.block)
        return res
    }, [])
    blocks.sort()
    let items = [
        { value: 'All', text: 'All' },
        ...blocks.map((el) => ({ value: el, text: el })),
    ]
    // Clear existing options
    dropdown.innerHTML = ''

    // Add new options
    items.forEach((item) => {
        const option = document.createElement('option')
        option.value = item.value
        option.textContent = item.text
        option.selected = option.value.toLowerCase() === currBlock.toLowerCase()
        dropdown.appendChild(option)
    })
}

function changeTab(tab) {
    if (currTab === tab) return
    else if (tab === 0) {
        currTab = 0
    } else if (tab === 1) {
        currTab = 1
    }
    updateView()
}

function sortAllDataOnDistance() {
    allData.sort((a, b) => {
        if (a.distance === '' && b.distance === '') {
            return 0
        } else if (a.distance === '') return 1
        else if (b.distance === '') return -1
        else return a.distance - b.distance
    })
}

function loadData(data) {
    if (!data) return
    selectedData = data.selectedData || []
    if (data.distanceData) {
        for (let row of allData) {
            let disObject = data.distanceData.find((el) => el.id === row.id)
            if (disObject) row.distance = disObject.distance
        }
    }
    sortAllDataOnDistance()
    updateView()
}

function main() {
    sortAllDataOnDistance()
    updateView()

    // search schoolname
    searchInput.addEventListener('input', (event) => {
        searchedString = event.target.value
        updateView()
    })

    dropdown.addEventListener('change', (event) => {
        currBlock = event.target.value
        updateView()
    })

    // change active tab
    selectionTab.addEventListener('click', (event) => {
        selectionTab.classList.add('active')
        viewTab.classList.remove('active')
        changeTab(0)
    })
    viewTab.addEventListener('click', (event) => {
        viewTab.classList.add('active')
        selectionTab.classList.remove('active')
        changeTab(1)
    })

    // saving data
    saveBtn.addEventListener('click', (event) => {
        let savedData = {
            distanceData: allData.filter((el) => el.distance !== ''),
            selectedData: selectedData,
        }
        const content = JSON.stringify(savedData)
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = 'savedData.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    })

    //loading data
    const loadDataInput = document.getElementById('loadDataInput')
    loadDataInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        if (file && file.type === 'application/json') {
            const reader = new FileReader()
            reader.onload = function (e) {
                try {
                    const jsonContent = JSON.parse(e.target.result)
                    loadData(jsonContent)
                } catch (error) {
                    alert('Error parsing JSON file: ' + error)
                }
            }
            reader.readAsText(file)
        } else {
            alert('Please select a valid JSON file.')
        }
    })

    // arrange button
    arrangeBtn.addEventListener('click', (event) => {
        selectedData.sort((a, b) => {
            if (a.priority && b.priority) return a.priority - b.priority
            else if (a.priority) return -1
            else if (b.priority) return 1
            else return 0
        })
        updateView()
    })

    nextPage.addEventListener('click', (event) => {
        page++
        updateView(true)
    })

    prevPage.addEventListener('click', (event) => {
        page--
        updateView(true)
    })
}

document.addEventListener('DOMContentLoaded', function () {
    main()
})
