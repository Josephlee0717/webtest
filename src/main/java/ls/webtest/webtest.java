package ls.webtest;
import java.math.*;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import scala.Math;

public class webtest {
	private static CopyOnWriteArraySet<MyWebSocket> webSocketSet = new CopyOnWriteArraySet<MyWebSocket>();
	public static void main(String[] args){
		
		String queueIDList = genQueueID();
		String getReturnFee =  getReturnFee();
		String processReturnFee= processReturnFee();
		System.out.println(getReturnFee);		
	}
	//IDÀ„∑®
	public static String genQueueID(){
		/*
		 * Every time, the customer create a record of pay action, I get paynumber , and count of ID ,
		 * Mak up ID list use userid , serial number and date ( userid + serial number + date).   
		 * and input mix queueID into lineup table ,input others into shalllineup table.
		*/		
		double paynumber = 576;
		//Count of ID
		double dCount = Math.floor(paynumber/100);
		int s1 = (int)dCount;
		String userid = "1100010001";
		Date dt = new Date();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");   
	    String today = sdf.format(dt);
	    DecimalFormat df = new DecimalFormat("0000");
	    
		Map rtn = new HashMap();
		for(int i = 0 ; i< s1 ; i++){
			rtn.put("key"+String.valueOf(i+1), userid+df.format(i+1).toString()+today);
		}
		//input every QueueIDs into 
		return rtn.toString();
	}
	
	/**
	 * GET return fee from pay table
	 * @lijun
	 */
	
	public static String getReturnFee(){
		//Total of customer consume
		double consumeTotal = 1453.87;
		//The customer current consume in pay table
		double curConsume = 432.50;
		//The expression is: ((consumeTotal mod 100) + curConsume) /100 
		double rtn = ((consumeTotal%100) + curConsume)/100;
		DecimalFormat df = new java.text.DecimalFormat("#.00");
		String rtnStr = df.format(rtn);
		return String.valueOf(rtnStr);
		
		//The SQL expression as this below:
		//SELECT ((consumeTotal%100)+curConsume)/100
	}
	
	
	//ReturnFee 
	public static String processReturnFee(){
		WebSocket ws = new WebSocket();
		return "";
	}
}
