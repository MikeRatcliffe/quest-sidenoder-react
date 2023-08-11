import React from "react";
import PropTypes from "prop-types";

function Icon({
  width = 512,
  height = 512,
  fill = "#202020",
  stroke = "#e4e1dc",
  title = "Quest Sidenoder Logo",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      version="1"
      viewBox="0 0 512 512">
      <title>{title}</title>
      <g fill={fill} transform="matrix(.03558 0 0 -.03563 0 512)">
        <path
          fill={stroke}
          d="M7.774 -14362.15H14397.88V7.7630000000008295H7.774z"
          transform="scale(1 -1)"
        />
        <path d="M0 7185V0h14390v14370H0V7185zm7590 6830c19-3 119-8 223-12 103-3 187-10 187-15 0-4 34-8 76-8s104-5 138-10c33-6 129-22 211-35 896-150 2106-672 2845-1226 210-157 329-267 705-643 409-411 602-625 787-876 545-741 945-1639 1147-2580 34-157 88-459 101-560 6-52 13-106 16-120 19-110 36-477 36-750 0-326-14-554-52-863-28-219-93-578-126-691-7-27-11-52-9-56 7-11-71-276-139-476-177-521-442-1091-699-1504-574-922-1390-1727-2307-2277-562-336-1214-604-1840-756-186-45-572-122-665-132-27-3-59-8-70-10s-49-7-85-10c-36-4-70-8-77-10-6-2-49-7-95-10-46-4-94-8-108-11-168-26-919-25-1185 2-147 15-459 56-520 68-353 70-798 182-1020 257-665 223-1357 577-1854 948-306 227-834 730-1231 1171-662 734-1159 1722-1409 2803-23 97-46 185-51 195-25 43-97 499-127 802-19 193-25 855-10 1070 23 318 70 670 112 830 8 30 39 156 69 280 220 901 676 1832 1277 2606 185 238 395 463 688 739 439 412 714 624 1156 887 549 328 1218 618 1810 784 55 15 101 31 103 36 2 4 20 12 40 17 43 12 423 77 497 86 28 3 84 10 125 15 201 25 369 39 565 46 88 4 161 8 163 9 6 5 567-4 602-10z" />
        <path d="M7188 13745c-2-1-118-5-258-8-140-4-271-8-290-11-19-2-71-7-115-11-113-8-187-16-205-20-8-2-46-7-85-11-89-8-89-8-95-15-3-3-61-15-130-28-790-145-1700-523-2445-1016-337-223-562-405-858-694-285-279-532-560-762-866-228-305-361-522-568-933-359-710-474-1040-633-1817-21-102-56-385-75-599-14-161-18-619-8-831 8-160 38-462 59-585 5-30 12-75 15-100 11-85 66-345 111-525 135-542 284-954 514-1420 322-654 629-1066 1269-1705 598-597 974-878 1600-1194s1208-510 1867-625c215-37 316-50 504-66 36-3 74-8 85-10 115-22 909-23 1045-1 14 2 63 7 110 11 46 4 87 8 90 10 3 1 39 6 79 9 41 4 77 9 80 10 4 2 35 7 69 10 35 4 101 14 145 22 45 9 93 18 107 20 14 3 106 23 205 46 99 22 194 42 210 43 54 5 264 64 475 135 968 322 1811 845 2553 1584 691 689 1235 1548 1567 2476 54 151 173 555 185 625 3 22 22 119 41 215s39 198 44 225c52 270 90 732 90 1080 0 216-19 596-35 695-2 14-7 50-10 80-7 59-38 258-55 355-5 33-12 82-15 110-3 27-21 119-41 205-144 621-377 1219-701 1799-201 359-438 692-718 1006-151 170-714 727-870 860-353 303-662 504-1165 755-825 412-1470 599-2300 665-107 8-215 17-240 20s-115 7-200 10c-85 4-174 8-197 9-23 2-43 3-45 1zm1645-2695c657-25 1171-77 1632-166 696-135 1278-333 1692-575 598-351 1047-862 1268-1444 367-966 395-2302 61-2885-150-262-329-360-656-360-351 0-617 94-1595 565-491 236-980 460-1415 648-422 182-898 354-1231 445-445 122-762 170-1184 179-985 21-1737-162-3030-737-240-107-358-161-905-420-659-311-1091-502-1341-596-157-58-320-86-499-85-160 0-252 20-375 80-247 122-413 403-484 818-55 327-50 1125 9 1488 126 768 447 1409 942 1880 351 334 886 623 1511 814 467 143 975 237 1547 286 332 28 1048 54 1920 68 442 8 1904 5 2133-3z" />
        <path d="M5920 10749c-333-4-688-12-790-18-595-36-1059-104-1555-226-546-134-1114-388-1472-656-366-275-722-797-907-1329-253-725-259-1889-13-2364 47-90 131-187 191-219 37-19 60-22 227-25 313-6 365 10 1074 331 125 56 482 224 1105 517 1050 494 1772 753 2522 904 321 64 573 81 1088 73 388-6 495-14 673-48 364-69 687-155 1068-285 510-174 1000-385 2069-894 461-219 947-437 1128-506 112-43 324-93 442-104 187-19 300 10 389 100 126 129 213 381 257 750 22 174 24 646 5 835-67 669-219 1183-469 1589-480 781-1347 1238-2807 1481-480 80-546 83-1850 95-1142 10-1502 10-2375-1z" />
      </g>
    </svg>
  );
}

Icon.propTypes = {
  fill: PropTypes.string,
  stroke: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export { Icon };