import scrapy
import re
from no_accent_vietnamese import no_accent_vietnamese as NAV


class CovidSpider(scrapy.Spider):
   name = 'covid'
   allowed_domains = ['web.archive.org']
   start_urls = ['https://web.archive.org/web/20210907023426/https://ncov.moh.gov.vn/vi/web/guest/dong-thoi-gian']
    
   def parse(self, response):
      get_data = response.xpath("//div[@class = 'timeline-detail']")
      for data in get_data :
         time = data.xpath(".//div[@class = 'timeline-head']/h3/text()").get()
         p2= data.xpath(".//div[@class = 'timeline-content']/p[2]/text()").get()
         convert_p2 = NAV(p2)
         if convert_p2[:12] == "THONG BAO VE":
            case_str =re.search(r'(\d+(?:\.\d+)?)', convert_p2).group(1)
            new_case = case_str.replace(".","")
            yield{
                  'time' : time,
                  'content' : int(new_case)
               }   
      link = response.xpath("//ul[@class = 'lfr-pagination-buttons pager']/li[2]/a/@href").get()
      if link is not None :
         yield scrapy.Request(url = link, callback = self.parse)