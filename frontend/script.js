/* =========================================================
   LEGISWATCH
   FRONTEND JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const checkButton =
    document.getElementById("checkButton");

const buttonText =
    document.getElementById("buttonText");

const statusText =
    document.getElementById("status");

const emailInput =
    document.getElementById("emailInput");

const results =
    document.getElementById("results");

const emptyState =
    document.getElementById("emptyState");

const resultCount =
    document.getElementById("resultCount");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const pageNumber =
    document.getElementById("pageNumber");


/* =========================================================
   SETTINGS
========================================================= */

const limit = 5;

let currentPage = 1;

let currentSearch = "";


/* =========================================================
   TEMPORARY LEGISLATION DATA
========================================================= */

const legislation = [

    {
        bill_id: 32366,
        bill_name:
            "„დაგროვებითი პენსიის შესახებ“ საქართველოს კანონში ცვლილების შეტანის თაობაზე",
        bill_type:
            "საქართველოს კანონის პროექტი",
        registration_number:
            "364/3-XIმპ",
        registration_date:
            "09-09-2026"
    },

    {
        bill_id: 32371,
        bill_name:
            "საქართველოს ინტელექტუალური საკუთრების შესახებ კანონში ცვლილების შეტანის თაობაზე",
        bill_type:
            "საქართველოს კანონის პროექტი",
        registration_number:
            "365/2-XIმპ",
        registration_date:
            "09-09-2026"
    },

    {
        bill_id: 32372,
        bill_name:
            "საქართველოს სისხლის სამართლის კოდექსში ცვლილების შეტანის თაობაზე",
        bill_type:
            "საქართველოს კანონის პროექტი",
        registration_number:
            "366/2-XIმპ",
        registration_date:
            "10-09-2026"
    },

    {
        bill_id: 32375,
        bill_name:
            "საქართველოს ადმინისტრაციულ სამართალდარღვევათა კოდექსში ცვლილების შეტანის თაობაზე",
        bill_type:
            "საქართველოს კანონის პროექტი",
        registration_number:
            "367/2-XIმპ",
        registration_date:
            "10-09-2026"
    },

    {
        bill_id: 32380,
        bill_name:
            "„პერსონალურ მონაცემთა დაცვის შესახებ“ საქართველოს კანონში ცვლილების შეტანის თაობაზე",
        bill_type:
            "საქართველოს კანონის პროექტი",
        registration_number:
            "368/2-XIმპ",
        registration_date:
            "11-09-2026"
    }

];


/* =========================================================
   LOAD LEGISLATION
========================================================= */

function loadBills() {

    let filteredBills =
        legislation;


    /* SEARCH */

    if (currentSearch !== "") {

        filteredBills =
            legislation.filter(
                function (bill) {

                    return bill.bill_name
                        .toLowerCase()
                        .includes(
                            currentSearch.toLowerCase()
                        );

                }
            );

    }


    /* PAGINATION */

    const start =
        (currentPage - 1) * limit;

    const end =
        start + limit;

    const pageBills =
        filteredBills.slice(
            start,
            end
        );


    renderBills(
        pageBills,
        filteredBills.length
    );


    pageNumber.textContent =
        currentPage;


    /* PREVIOUS */

    previousButton.disabled =
        currentPage === 1;


    /* NEXT */

    nextButton.disabled =
        end >= filteredBills.length;

}


/* =========================================================
   RENDER LEGISLATION
========================================================= */

function renderBills(
    bills,
    totalResults
) {

    results.innerHTML = "";


    /* NO RESULTS */

    if (bills.length === 0) {

        results.style.display =
            "none";

        emptyState.style.display =
            "block";

        resultCount.textContent =
            "0 შედეგი";

        return;

    }


    /* RESULTS */

    emptyState.style.display =
        "none";

    results.style.display =
        "block";


    const start =
        (currentPage - 1) * limit + 1;

    const end =
        start + bills.length - 1;


    resultCount.textContent =
        `ნაჩვენებია ${start}–${end} ${totalResults}-დან`;


    bills.forEach(
        function (bill) {


            const billUrl =
                `https://info.parliament.ge/#law-drafting/${bill.bill_id}`;


            const row =
                document.createElement(
                    "article"
                );


            row.className =
                "bill-row";


            row.innerHTML = `

                <div class="bill-name">

                    ${escapeHTML(
                        bill.bill_name
                    )}

                </div>


                <div>

                    <span class="bill-status">

                        ${escapeHTML(
                            bill.bill_type
                        )}

                    </span>

                </div>


                <div class="bill-info">

                    ${escapeHTML(
                        bill.registration_number
                    )}

                </div>


                <div class="bill-info">

                    ${escapeHTML(
                        bill.registration_date
                    )}

                </div>


                <div class="bill-arrow">

                    <a
                        href="${billUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        →

                    </a>

                </div>

            `;


            results.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

searchButton.addEventListener(
    "click",
    function () {

        currentSearch =
            searchInput.value.trim();

        currentPage = 1;

        loadBills();

    }
);


/* =========================================================
   ENTER = SEARCH
========================================================= */

searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            currentSearch =
                searchInput.value.trim();

            currentPage = 1;

            loadBills();

        }

    }
);


/* =========================================================
   PAGINATION
========================================================= */

nextButton.addEventListener(
    "click",
    function () {

        currentPage++;

        loadBills();

    }
);


previousButton.addEventListener(
    "click",
    function () {

        if (currentPage > 1) {

            currentPage--;

            loadBills();

        }

    }
);


/* =========================================================
   CHECK FOR UPDATES
========================================================= */

checkButton.addEventListener(
    "click",
    async function () {

        const email =
            emailInput.value.trim();


        /* CHECK EMAIL */

        if (email === "") {

            statusText.textContent =
                "Please enter your email address.";

            emailInput.focus();

            return;

        }


        /* SIMPLE EMAIL CHECK */

        if (
            !email.includes("@") ||
            !email.includes(".")
        ) {

            statusText.textContent =
                "Please enter a valid email address.";

            emailInput.focus();

            return;

        }


        /* LOADING */

        checkButton.disabled =
            true;

        buttonText.textContent =
            "CHECKING...";

        statusText.textContent =
            "Checking parliamentary data...";


        try {

            const response =
                await fetch(
                    "https://legiswatch-production.up.railway.app/check-updates",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: email
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Something went wrong."
                );

            }


            /* SUCCESS */

            statusText.textContent =
                "Updates checked successfully. Please check your email.";


        }

        catch (error) {

            console.error(error);

            statusText.textContent =
                "Unable to check updates. Please try again.";

        }


        finally {

            buttonText.textContent =
                "CHECK FOR UPDATES";

            checkButton.disabled =
                false;

        }

    }
);


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadBills();