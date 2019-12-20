// ==UserScript==
// @name        Juror
// @include     https://www.sfsuperiorcourt.org/divisions/jury-services/jury-reporting
// @description Modifies the SF Jury site
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    	GM_addStyle
// ==/UserScript==


(function hideElements() {
    let elementsToHide = [
        '.contentLeftColumn',
        '#headerBar',
        '#topNavBar',
        '.breadcrumb',
        '.clear20',
        '#footer',
        '#hrDarkBorder',
        '#skip-link',
        '#warning-container',
        '#hrBorderSub',
    ];

    for (const element of elementsToHide) {
        $(element).hide();
    }

    let h3Count = 0;

    document.querySelectorAll('*').forEach(function (node, i) {
        if ($(node).is('h3')) {
            h3Count++;
        }

        if (h3Count > 2) {
            $(node).hide();
        }
    });

    $('div[class="addThis"]').parent().hide();
})();

(function main() {
    let addresses = [];
    let h3Count = 0;
    let status = null;
    let instructions2 = null;


    $(".hero.col-xs-12").append(`
      <ul id="buttons"></div>
    `);
    document.querySelectorAll('*').forEach(function (node, i) {
        if ($(node).is('h3')) {
            h3Count++;
        }

        if (h3Count > 2) {
            return;
        }

        if ($(node).is('h3')) {
            addresses.push($(node).text());
        }

        if ($(node).is('p')) {
            $.trim($(node).text());
            const text = $(node).text();
            const status2 = status;
            const curH3Count = h3Count;
            const regex = /[^-\d](\d{3})[^-\d]?((\s(report|revisit|and))|,|\.)/g;
            if (regex.test(text)) {
                let groups = text.match(regex).map(function (el) {
                    return el.replace(/\D/g, "")
                });

                let groupLinks = groups.map(function (el, i) {
                    return `<button id="group_${el}" class="btn btn-primary deselected" type="button">${el}</button>`
                });

                let address = addresses[curH3Count - 1];
                address = address.toLowerCase()
                    .split(' ')
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');

                if ($(`#${address.split(' ')[0]}`).length) {
                    $(`#${address.split(' ')[0]}`).append(` `);
                    $(`#${address.split(' ')[0]}`).append(`${groupLinks.join(' ')}`);
                } else {
                    $("#buttons").append(`
                      <li id="${address.split(' ')[0]}">${groupLinks.join(' ')}</li>
                    `);
                }

                $(`#${address.split(' ')[0]}`).children().sort((a, b) => {
                    return $(a).attr('id').split('group_')[1] > $(b).attr('id').split('group_')[1]
                });

                groups.forEach((el, i) => {
                    $(`#group_${el}`).click(function () {
                        $(this).toggleClass("deselected");

                        const cousins = [].concat.apply([], $(this).parent().parent().parent().find('button'));
                        if (cousins.every((el2) => {
                                return $(el2).hasClass('deselected');
                            })) {
                            $('#mainContent').show();
                        } else {
                            $('#mainContent').hide();
                        }

                        if ($(this).hasClass('deselected')) {
                            $(`#info_${el}`).remove();
                        } else {
                            instructions3 = $(node).text().split(/(revisit|report|your)/).slice(1).join(' ');
                            instructions3 = instructions3.charAt(0).toUpperCase() + instructions3.slice(1);
                            let instructions = status2 === 'ALREADY REPORTED' ? instructions2 : instructions3;

                            $('.contentMain').append(`
                              <div id="info_${el}">
                                <h3>Group ${el}</h3>
                                <p>Location: ${address}</p>
                                <p>Status: ${status2}</p>
                                <p>Instructions: ${instructions}</p>
                              </div>
                            `);

                            let infoList = $('.contentMain').children().toArray()
                                .filter((info) => {
                                    return $(info).attr('id') && $(info).attr('id').includes('info');
                                });

                            infoList.sort((a, b) => {
                                return $(a).attr('id').split('info_')[1] > $(b).attr('id').split('info_')[1]
                            });

                            infoList.forEach(function (e) {
                                var elem = $(e);
                                elem.remove();
                                $(elem).appendTo(".contentMain");
                            });
                        }
                    });

                    var elem = $(el);
                    elem.remove();
                    $(elem).appendTo($(`#${address.split(' ')[0]}`));
                });
            } else if ($(node).has('strong').length > 0) {
                let title = text.split(':')[0];
                instructions2 = text.split(':')[1];
                status = title.split(' ').slice(1).join(' ');
            }
        }
    });

    $('div[class="addThis"]').parent().hide();
})();

(function removeClasses() {
    $('.contentMain').removeClass('col-xs-9');
    $('.contentMain').removeClass('leftBorder');
})();

GM_addStyle(`
  #contentWrap {
//    padding-left: 15em;
//    padding-right: 15em;
    background: none;
  }

  #hrBorderSub {
    background: none;
  }

  #main {
    padding: 0;
  }

  #page.container {
    max-width: 100%;
    width: 100% !important;
  }

  div, h1, h3, span {
    color: white !important;
    font-family: Verdana, Arial, Helvetica, sans-serif;
  }

  html, body {
    background: black;
  }

  a:link {
    color: lightgray;
  }

  a:visited {
    color: gray;
  }

  .hero h1:nth-child(2) {
    padding: 1rem;
    font-size: 3rem;
    font-family: Verdana, Arial, Helvetica, sans-serif;

//display: block; /* may help stop any text wrapping and display it inline. */
display: inline-block; /* same as above */
white-space: nowrap;/* ensure no wrapping */
overflow: hidden; /* if for some reason it escapes the visible area don't display anything. */
  }

  h3, h3 span {
    font-size: 2rem !important;
    font-family: Verdana, Arial, Helvetica, sans-serif !important;
  }

  article {
    display: table;
    margin: 0 auto;
  }

  #block-system-main {
    width:100%
  }

  #mainContentWrap .contentMain {
    padding: 0;
  }

  .hero {
    padding: 0;
  }

  .col-xs-12 {
    padding: 0;
  }

  .btn {
    margin: 6px !important;
  }

  button.deselected {
    background: #333;
  }

  @media print {
    #buttons{
        display: none;
    }
  }

  #content {
    box-shadow: none;
  }
`);