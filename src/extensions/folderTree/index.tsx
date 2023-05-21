import * as molecule from 'mo/molecule.api';
import { IExtension } from 'mo/model/extension';
import {
  IEditorTab,
  BuiltInEditorTabDataType,
} from 'mo/model/workbench/editor';
import { cloneDeep } from 'lodash';
import folderTreeData from "../data/folderTree.json";
import { FileType, FileTypes, Float, IFolderTreeNodeProps, TreeNodeModel } from 'mo/model';
import { transformToEditorTab, updateStatusBarLanguage, updateStatusBarLocation } from '../helper';
import { UniqueId } from 'mo/common/types';
import { randomId } from 'mo/common/utils';


/**
 * h获取所有文件夹节点 字符串型ID
 * @param dataSource 
 * @param uniqueId 
 * @param childrenField 
 * @returns 
 */
function getAllFolderNodeStrId(dataSource: Record<string, any>, uniqueId: string = 'id', childrenField: string = 'children') {
  let result: string[] = [];
  let traverse = (dataSource: Record<string, any>) => {
    if(['RootFolder', 'Folder'].includes(dataSource.fileType)) {
      result.push(`${dataSource[`${uniqueId}`]}`);
    }

    if(Array.isArray(dataSource[`${childrenField}`])) {
      for(let item of dataSource[`${childrenField}`]) {
        traverse(cloneDeep(item));
      }
    }
  }
  traverse(dataSource);
  return result;
}

const getFolderList = async () => {
  return cloneDeep(folderTreeData.data) as any;
}

export const ExtendsFolderTree: IExtension = {
  id: 'ExtendsFolderTree',
  name: 'Extends FolderTree',
  async activate() {
    // 初始化添加文件列表
    molecule.folderTree.add(await getFolderList());

    // 默认展开所有树形节点
    molecule.folderTree.setExpandKeys(getAllFolderNodeStrId(folderTreeData.data))

    // 创建文件
    molecule.folderTree.onCreate((type: FileType, nodeId?: UniqueId) => {
      const folderTreeNode = new TreeNodeModel({
        id: randomId(),
        name: '',
        fileType: type,
        isEditable: true,
        icon: 'file-code',
    })
      molecule.folderTree.add(folderTreeNode, nodeId)
    })

    // 处理选中目录的回调逻辑
    molecule.folderTree.onSelectFile((file: IFolderTreeNodeProps) => {
      // TODO: getStrSql API
      const currentItem = {
        icon: 'file-code',
        ...file,
        data: {
          // eslint-disable-next-line
          value: "SELECT my.id, my.date, my.business_date AS businessDate, my.CODE, my.customer_id AS customerId, cc.NAME AS customerName, cc.boss_name AS bossName, my.contact_person_id AS contactPersonId, ccp.NAME AS contactPersonName, my.department_id AS departmentId, dep.NAME AS departmentName, csopd.NAME AS saleOrderDepartmentName, parentpd.NAME AS parentDepartmentName, parentcsopd.NAME AS saleOrderParentDepartmentName, ca.agent_type AS agentType, csoca.agent_type AS saleOrderAgentType, my.achievement_type AS achievementType, my.audit_status AS auditStatus, my.type, my.order_type AS orderType, my.quote_money AS quoteMoney, my.offset_money AS offsetMoney, my.receipt_money AS receiptMoney, my.amount, my.create_by AS createBy, su.NAME AS createByName, my.counselor, coun.NAME AS counselorName, my.course_id AS courseId, course.NAME AS courseName, achi.NAME AS achievementDepartmentName, my.create_time AS createTime, ifnull(IF(0 > csod.all_money - sum(csod.refund_money) - sum( csod.delivery_money ), 0, csod.all_money - sum( csod.refund_money ) - sum( csod.delivery_money )), 0) AS unDeliveryMoney, ifnull(IF(0 > csod.all_money - sum(csod.refund_money ) - sum( csod.settle_money ), 0, csod.all_money - sum( csod.refund_money ) - sum( csod.settle_money )), 0) AS unSettleMoney, ifnull( sum( csod.delivery_money ), 0 ) AS deliveryMoney, ifnull( sum( csod.settle_money ), 0 ) AS settleMoney, sum( csod.amount * csod.money ) AS detailTotalMoney, cc.market_manage AS marketManage, mm.NAME AS marketManageName, cc.server_manage AS serverManage, sm.NAME AS serverManageName, cc.invite_manage AS inviteManage, im.NAME AS inviteManageName, my.order_market_manage AS orderMarketManage, omm.NAME AS orderMarketManageName, my.order_server_manage AS orderServerManage, osm.NAME AS orderServerManageName, my.market_director AS marketDirector, md.NAME AS marketDirectorName, my.server_director AS serverDirector, sd.NAME AS serverDirectorName, au.NAME AS developManageName, csodm.NAME AS saleOrderDevelopManageName,IF( coc.id IS NULL, 1, 2 ) AS orderContractStatus, coc.audit_status AS orderContractAuditStatus, my.extend_teacher_id AS extendTeacherId, (SELECT NAME FROM pub_department WHERE id=my.extend_teacher_id) AS extendTeacherName,IF( ecd.sign_status IS NULL, 0, ecd.sign_status ) AS esignContractSignStatus FROM crm_sale_order my LEFT JOIN crm_customer cc ON cc.id = my.customer_id LEFT JOIN crm_contact_person ccp ON ccp.id = my.contact_person_id LEFT JOIN pub_department dep ON dep.id = cc.department_id LEFT JOIN pub_department csopd ON csopd.id = my.department_id LEFT JOIN pub_department parentpd ON parentpd.id = dep.parent_id LEFT JOIN pub_department parentcsopd ON parentcsopd.id = csopd.parent_id LEFT JOIN sys_user su ON su.id = my.create_by LEFT JOIN sys_user coun ON coun.id = my.counselor LEFT JOIN crm_course course ON course.id = my.course_id LEFT JOIN pub_department achi ON achi.id = my.achievement_department LEFT JOIN crm_sale_order_detail csod ON csod.sale_order_id = my.id  AND csod.deleted = 0 LEFT JOIN sys_user mm ON mm.id = cc.market_manage LEFT JOIN sys_user sm ON sm.id = cc.server_manage LEFT JOIN sys_user im ON im.id = cc.invite_manage LEFT JOIN sys_user omm ON omm.id = my.order_market_manage LEFT JOIN sys_user osm ON osm.id = my.order_server_manage LEFT JOIN sys_user md ON md.id = my.market_director LEFT JOIN sys_user sd ON sd.id = my.server_director LEFT JOIN crm_agent ca ON ca.department_id = cc.department_id LEFT JOIN crm_agent csoca ON csoca.department_id = my.department_id LEFT JOIN sys_user au ON au.id = ca.develop_manage LEFT JOIN sys_user csodm ON csodm.id = csoca.develop_manage LEFT JOIN crm_order_contract coc ON coc.sale_order_id = my.id  AND coc.deleted = 0 LEFT JOIN esign_contract ec ON ec.sale_order_id = my.id LEFT JOIN esign_contract_detail ecd ON ecd.contract_id = ec.id  AND ecd.deleted = 0  AND ecd.record_type = 2 WHERE my.deleted = 0 GROUP BY my.id ORDER BY id DESC LIMIT 1",
          language: 'sql'
        },

      }
      molecule.editor.open(transformToEditorTab(currentItem));
      updateStatusBarLanguage(currentItem.data.language);
      updateStatusBarLocation(currentItem.location);
    })

    // 重命名
    molecule.folderTree.onRename((id) => {
      molecule.folderTree.update({
        id,
        isEditable: true,
      });
    });

    // 更新文件名
    molecule.folderTree.onUpdateFileName((file) => {
      // TODO: updateFileAPI
      const { id, name, location } = file;
      if (name) {
        const newLoc = location?.split('/') || [];
        newLoc[newLoc.length - 1] = name;
        const newLocation = newLoc.join('/');
        molecule.folderTree.update({
          ...file,
          id,
          location: newLocation,
          isEditable: false,
        });

        const groupId = molecule.editor.getGroupIdByTab(id.toString());
        const isValidGroupId = !!groupId || groupId === 0;
        if (isValidGroupId) {
          const prevTab =
            molecule.editor.getTabById<BuiltInEditorTabDataType>(
              id.toString(),
              groupId
            );
          const newTab: IEditorTab = { id: id.toString(), name };
          const prevTabData = prevTab?.data;
          if (prevTabData && prevTabData.path) {
            newTab.data = { ...prevTabData, path: newLocation };
          }
          molecule.editor.updateTab(newTab);
        }
      } else {
        const node = molecule.folderTree.get(id);
        if (node?.name) {
          molecule.folderTree.update({
            id,
            isEditable: false,
          });
        } else {
          molecule.folderTree.remove(id);
        }
      }
    });

    molecule.folderTree.onRefreshFolderList(async () => {
      console.log("刷新")
      molecule.folderTree.reset();
      const list = await getFolderList();
      molecule.folderTree.add(list);
    })

    // 展开文件夹
    molecule.folderTree.onExpandKeys((expandKeys) => {
      molecule.folderTree.setExpandKeys(expandKeys);
    });

  },
  dispose() { },
};
