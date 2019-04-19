var DateUtil = {
	//定义全局变量 
	tgString: "甲乙丙丁戊己庚辛壬癸",
	dzString: "子丑寅卯辰巳午未申酉戌亥",
	numString: "一二三四五六七八九十",
	monString: "正二三四五六七八九十冬腊",
	weekString: "日一二三四五六",
	sx: "鼠牛虎兔龙蛇马羊猴鸡狗猪",
	cYear: null,
	cMonth: null,
	cDay: null,
	TheDate: null,

	/*获取当前农历*/
	getLunar: function() {
		var D = new Date();
		var yy = D.getFullYear();
		var mm = D.getMonth() + 1;
		var dd = D.getDate();
		var ww = D.getDay();
		var ss = parseInt(D.getTime() / 1000);
		if(yy < 100) yy = "19" + yy;
		return DateUtil.GetLunarDay(yy, mm, dd);
	},

	/*判断一个日期是昨天、今天、明天还是后天*/
	getDateString: function(dateString) {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDay();

		var targeDate = new Date(dateString);
		var iday = parseInt(targeDate - date) / 1000 / 60 / 60 / 24;

		var dateStr;
		if(iday <= -1) {
			dateStr = "昨天";
		} else if(iday <= 0) {
			dateStr = "今天";
		} else if(iday<=1){
			dateStr="明天";
		}else if(iday<=2){
			dateStr="后天";
		}else{
			dateStr = DateUtil.getWeekDate(dateString);
		}
		return dateStr;
	},

	/*获取礼拜*/
	getWeekDate: function(dateString) {
		var date;
		if(dateString) {
			date = new Date(dateString);
		} else {
			date = new Date();
		}
		var weekday = new Array(7);
		weekday[0] = '周日';
		weekday[1] = '周一';
		weekday[2] = '周二';
		weekday[3] = '周三';
		weekday[4] = '周四';
		weekday[5] = '周五';
		weekday[6] = '周六';
		weekday = weekday[date.getDay()];
		return weekday;
	},

	getCurrentDate: function(fmt) {
		var date = new Date();
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if(/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},

	GetBit: function(m, n) {
		return(m >> n) & 1;
	},
	//农历转换 
	e2c: function() {
		var CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
		var madd = new Array(12);
		madd[0] = 0;
		madd[1] = 31;
		madd[2] = 59;
		madd[3] = 90;
		madd[4] = 120;
		madd[5] = 151;
		madd[6] = 181;
		madd[7] = 212;
		madd[8] = 243;
		madd[9] = 273;
		madd[10] = 304;
		madd[11] = 334;
		TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
		var total, m, n, k;
		var isEnd = false;
		var tmp = TheDate.getYear();
		if(tmp < 1900) {
			tmp += 1900;
		}
		total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;

		if(TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
			total++;
		}
		for(m = 0;; m++) {
			k = (CalendarData[m] < 0xfff) ? 11 : 12;
			for(n = k; n >= 0; n--) {
				if(total <= 29 + DateUtil.GetBit(CalendarData[m], n)) {
					isEnd = true;
					break;
				}
				total = total - 29 - DateUtil.GetBit(CalendarData[m], n);
			}
			if(isEnd) break;
		}
		DateUtil.cYear = 1921 + m;
		DateUtil.cMonth = k - n + 1;
		DateUtil.cDay = total;
		if(k == 12) {
			if(cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
				cMonth = 1 - cMonth;
			}
			if(cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
				cMonth--;
			}
		}
	},

	GetcDateString: function() {
		var tmp = "";
		if(DateUtil.cMonth < 1) {
			tmp += "(闰)";
			tmp += DateUtil.monString.charAt(-DateUtil.cMonth - 1);
		} else {
			tmp += DateUtil.monString.charAt(DateUtil.cMonth - 1);
		}
		tmp += "月";
		tmp += (DateUtil.cDay < 11) ? "初" : ((DateUtil.cDay < 20) ? "十" : ((DateUtil.cDay < 30) ? "廿" : "三十"));
		if(DateUtil.cDay % 10 != 0 || DateUtil.cDay == 10) {
			tmp += DateUtil.numString.charAt((DateUtil.cDay - 1) % 10);
		}
		return tmp;
	},

	GetLunarDay: function(solarYear, solarMonth, solarDay) {
		//solarYear = solarYear<1900?(1900+solarYear):solarYear; 
		if(solarYear < 1921 || solarYear > 2020) {
			return "";
		} else {
			solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
			DateUtil.e2c(solarYear, solarMonth, solarDay);
			return DateUtil.GetcDateString();
		}
	}
}